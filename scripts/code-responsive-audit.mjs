#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

// Helper to recursively list files
function getFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  for (const file of files) {
    const name = path.join(dir, file);
    if (statSync(name).isDirectory()) {
      if (!file.startsWith(".") && file !== "node_modules" && file !== ".next") {
        getFiles(name, fileList);
      }
    } else {
      if (/\.(tsx|ts|js|jsx)$/.test(file)) {
        fileList.push(name);
      }
    }
  }
  return fileList;
}

const files = getFiles(srcDir);
const findings = [];

// Regexes for code audit
const GRID_REGEX = /(?<!\b(sm|md|lg|xl|2xl):)grid-cols-([2-9]|1[0-2])\b/g;
const FIXED_WIDTH_REGEX = /(?<!\b(sm|md|lg|xl|2xl):)(?:w|min-w)-\[(\d+)px\]/g;
const INLINE_STYLE_WIDTH_REGEX = /style=\{\{\s*(width|minWidth)\s*:\s*['"`](\d+)px['"`]\s*\}\}/g;
const NO_WRAP_FLEX_REGEX = /className=["'][^"']*\bflex\b(?!.*\b(flex-wrap|flex-col|sm:flex-|md:flex-|lg:flex-)\b)[^"']*["']/g;

for (const file of files) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");
  const relativePath = path.relative(rootDir, file);

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Grid check: non-responsive grid-cols-2+
    let match;
    GRID_REGEX.lastIndex = 0;
    while ((match = GRID_REGEX.exec(line)) !== null) {
      findings.push({
        file: relativePath,
        line: lineNum,
        code: line.trim(),
        type: "Non-responsive Grid Cols",
        detail: `Found '${match[0]}'. On mobile, grids with 2 or more columns can easily overflow or cramp the content unless wrapped or prefixed (e.g. 'grid-cols-1 md:grid-cols-2').`,
        severity: "Medium",
        suggestion: `Change to 'grid-cols-1 sm:grid-cols-${match[2]}' or similar.`
      });
    }

    // 2. Fixed Width check: w-[Xpx] or min-w-[Xpx] where X > 250px without breakpoint prefix
    FIXED_WIDTH_REGEX.lastIndex = 0;
    while ((match = FIXED_WIDTH_REGEX.exec(line)) !== null) {
      const width = parseInt(match[2], 10);
      if (width > 250) {
        findings.push({
          file: relativePath,
          line: lineNum,
          code: line.trim(),
          type: "Hardcoded Large Width",
          detail: `Found '${match[0]}' (${width}px). This will overflow on screen sizes smaller than ${width}px (e.g. mobile at 375px or 390px).`,
          severity: "High",
          suggestion: `Make it responsive: 'w-full sm:${match[0]}' or use max-width limit 'w-full max-w-[${width}px]'.`
        });
      }
    }

    // 3. Inline style check
    INLINE_STYLE_WIDTH_REGEX.lastIndex = 0;
    while ((match = INLINE_STYLE_WIDTH_REGEX.exec(line)) !== null) {
      const width = parseInt(match[2], 10);
      if (width > 250) {
        findings.push({
          file: relativePath,
          line: lineNum,
          code: line.trim(),
          type: "Inline Style Large Width",
          detail: `Found inline style setting ${match[1]} to '${width}px'. Inline styles bypass Tailwind media queries and prevent fluid responsiveness.`,
          severity: "High",
          suggestion: `Replace with Tailwind responsive class: 'w-full md:${match[1] === 'width' ? 'w' : 'min-w'}-[${width}px]' or 'w-full max-w-[${width}px]'.`
        });
      }
    }
  });
}

// Generate reports
let mdReport = `# Static Code Audit Report for Responsiveness\n\n`;
mdReport += `Generated on: ${new Date().toLocaleString()}\n`;
mdReport += `Total Files Scanned: ${files.length}\n`;
mdReport += `Total Issues Found: ${findings.length}\n\n`;

mdReport += `## Summary of Issues\n\n`;
mdReport += `| Severity | Count | Description |\n`;
mdReport += `|---|---|---|\n`;
mdReport += `| High | ${findings.filter(f => f.severity === "High").length} | Hardcoded absolute widths larger than mobile screens (>250px) that directly break responsive layout flow |\n`;
mdReport += `| Medium | ${findings.filter(f => f.severity === "Medium").length} | Multi-column grid systems that do not stack on mobile viewports |\n\n`;

mdReport += `## Detailed Findings\n\n`;
mdReport += `| File & Line | Issue Type | Severity | Detail | Suggestion |\n`;
mdReport += `|---|---|---|---|---|\n`;

findings.forEach(f => {
  const fileLink = `[${path.basename(f.file)}:${f.line}](file:///${path.resolve(rootDir, f.file)}#L${f.line})`;
  mdReport += `| ${fileLink} | **${f.type}** | \`${f.severity}\` | ${f.detail} | ${f.suggestion} |\n`;
});

const reportPath = path.join(rootDir, "docs", "RESPONSIVE_CODE_AUDIT.md");
writeFileSync(reportPath, mdReport, "utf-8");

console.log(`\nAudit completed successfully!`);
console.log(`Total issues found: ${findings.length}`);
console.log(`Report written to: ${reportPath}`);
