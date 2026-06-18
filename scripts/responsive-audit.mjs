#!/usr/bin/env node

import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const appDir = path.join(rootDir, "src", "app");
const outDir = path.join(rootDir, "responsive-audit");
const screenshotsDir = path.join(outDir, "screenshots");

const baseURL = process.env.RESPONSIVE_AUDIT_URL || "http://localhost:3333";
const extraRoutes = (process.env.RESPONSIVE_AUDIT_ROUTES || "")
  .split(",")
  .map((route) => route.trim())
  .filter(Boolean);
const auditRole = process.env.RESPONSIVE_AUDIT_ROLE || "owner";

const credentials = {
  owner: { username: "owner", password: "owner123", role: "Owner" },
  admin: { username: "admin", password: "admin123", role: "Admin" },
  kasir: { username: "kasir", password: "kasir123", role: "Kasir" },
  mekanik: { username: "mekanik", password: "mekanik123", role: "Mekanik" },
};

const activeCredential = credentials[auditRole.toLowerCase()] || credentials.owner;

const viewports = [
  { name: "iphone-se", width: 375, height: 667, isMobile: true },
  { name: "iphone-14", width: 390, height: 844, isMobile: true },
  { name: "android", width: 412, height: 915, isMobile: true },
  { name: "tablet", width: 768, height: 1024, isMobile: true },
];

const seededUser = {
  name: `Responsive Audit ${activeCredential.role}`,
  username: activeCredential.username,
  role: activeCredential.role,
};

function discoverRoutes(dir, routeParts = []) {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const routes = [];

  if (entries.some((entry) => entry.isFile() && /^page\.(t|j)sx?$/.test(entry.name))) {
    const visibleParts = routeParts
      .filter((part) => !part.startsWith("("))
      .filter((part) => !part.startsWith("@"))
      .filter((part) => part !== "index")
      .map((part) => (part.startsWith("[") ? "sample" : part));

    routes.push(`/${visibleParts.join("/")}`.replace(/\/+/g, "/"));
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    routes.push(...discoverRoutes(path.join(dir, entry.name), [...routeParts, entry.name]));
  }

  return routes;
}

function resetOutput() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(screenshotsDir, { recursive: true });
}

function screenshotName(route, viewport) {
  const cleanRoute = route === "/" ? "home" : route.replace(/^\//, "").replace(/[^\w-]+/g, "-");
  return `${viewport.name}__${cleanRoute}.png`;
}

async function seedAuth(page) {
  await page.addInitScript((user) => {
    window.localStorage.setItem("auth_token", "responsive-audit-token");
    window.localStorage.setItem("auth_refresh_token", "responsive-audit-refresh-token");
    window.localStorage.setItem("auth_user", JSON.stringify(user));
    window.localStorage.setItem(
      "permissions_cache_v1",
      JSON.stringify({
        role: user.role,
        permissions: ["*"],
        cachedAt: Date.now(),
      }),
    );
  }, seededUser);
}

async function loginContext(context) {
  const page = await context.newPage();

  try {
    await page.goto(new URL("/auth/sign-in", baseURL).toString(), {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    });
    await page.waitForTimeout(2000);
    await page.fill('input[name="username"]', activeCredential.username);
    await page.fill('input[name="password"]', activeCredential.password);
    await page.click('button[type="submit"]');
    await page.waitForFunction(
      () => Boolean(window.localStorage.getItem("auth_token") || window.sessionStorage.getItem("auth_token")),
      null,
      { timeout: 12_000 },
    );

    const authState = await page.evaluate(() => ({
      token: window.localStorage.getItem("auth_token") || window.sessionStorage.getItem("auth_token"),
      user: window.localStorage.getItem("auth_user") || window.sessionStorage.getItem("auth_user"),
    }));

    await page.close();
    return {
      mode: "real-login",
      ok: Boolean(authState.token && authState.user),
      message: `Login sebagai ${activeCredential.username}`,
    };
  } catch (error) {
    await seedAuth(page);
    await page.close().catch(() => {});
    return {
      mode: "seeded-fallback",
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function inspectLayout(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth || 0,
    );

    const ignoreTags = new Set(["SCRIPT", "STYLE", "META", "LINK", "TITLE"]);
    const offenders = [];

    for (const element of Array.from(document.body.querySelectorAll("*"))) {
      if (ignoreTags.has(element.tagName)) continue;
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || style.position === "fixed") {
        continue;
      }

      const rect = element.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;

      const overflowRight = rect.right - viewportWidth;
      const overflowLeft = -rect.left;
      if (overflowRight > 2 || overflowLeft > 2) {
        // Skip elements inside a horizontal scroll container (false positives)
        let isInsideScrollContainer = false;
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
          const parentStyle = window.getComputedStyle(parent);
          if (
            parentStyle.overflowX === "auto" ||
            parentStyle.overflowX === "scroll" ||
            parentStyle.overflow === "auto" ||
            parentStyle.overflow === "scroll"
          ) {
            isInsideScrollContainer = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (isInsideScrollContainer) continue;

        offenders.push({
          tag: element.tagName.toLowerCase(),
          text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          className: typeof element.className === "string" ? element.className.slice(0, 140) : "",
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          overflow: Math.round(Math.max(overflowRight, overflowLeft)),
        });
      }

      if (offenders.length >= 12) break;
    }

    return {
      title: document.title,
      path: window.location.pathname,
      viewportWidth,
      documentWidth,
      horizontalOverflow: documentWidth - viewportWidth,
      offenders,
    };
  });
}

function renderHtml(results) {
  const rows = results
    .map((result) => {
      const statusClass = result.ok ? "ok" : "fail";
      const issues = result.issues.length
        ? `<ul>${result.issues.map((issue) => `<li>${escapeHtml(issue)}</li>`).join("")}</ul>`
        : "<span class=\"muted\">Tidak ada issue utama.</span>";
      const offenders = result.layout?.offenders?.length
        ? `<details><summary>${result.layout.offenders.length} elemen overflow</summary><pre>${escapeHtml(JSON.stringify(result.layout.offenders, null, 2))}</pre></details>`
        : "";
      return `
        <tr class="${statusClass}">
          <td>${escapeHtml(result.route)}</td>
          <td>${escapeHtml(result.viewport.name)}<br><span class="muted">${result.viewport.width}x${result.viewport.height}</span></td>
          <td>${result.status ?? "-"}</td>
          <td>${escapeHtml(result.finalPath || "-")}</td>
          <td>${issues}${offenders}</td>
          <td><a href="${escapeHtml(result.screenshot)}">screenshot</a></td>
        </tr>`;
    })
    .join("");

  const failed = results.filter((result) => !result.ok).length;
  const total = results.length;

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Responsive Audit</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: #f6f8fb; color: #111827; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 20px; }
    h1 { margin: 0 0 6px; font-size: 28px; line-height: 1.2; }
    .muted { color: #6b7280; font-size: 12px; }
    .summary { display: flex; gap: 12px; margin: 20px 0; flex-wrap: wrap; }
    .pill { border: 1px solid #d1d5db; background: white; border-radius: 8px; padding: 10px 12px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; vertical-align: top; font-size: 13px; }
    th { background: #111827; color: white; position: sticky; top: 0; }
    tr.ok td:first-child { border-left: 4px solid #16a34a; }
    tr.fail td:first-child { border-left: 4px solid #dc2626; }
    ul { margin: 0; padding-left: 18px; }
    pre { max-width: 520px; overflow: auto; background: #f3f4f6; padding: 10px; border-radius: 6px; font-size: 12px; }
    a { color: #0f766e; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>Responsive Audit</h1>
    <div class="muted">Base URL: ${escapeHtml(baseURL)} | Generated: ${escapeHtml(new Date().toLocaleString("id-ID"))}</div>
    <div class="summary">
      <div class="pill">${total} checks</div>
      <div class="pill">${total - failed} passed</div>
      <div class="pill">${failed} flagged</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Route</th>
          <th>Viewport</th>
          <th>HTTP</th>
          <th>Final Path</th>
          <th>Issues</th>
          <th>Evidence</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function audit() {
  resetOutput();

  const routes = Array.from(new Set([...discoverRoutes(appDir), ...extraRoutes])).sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
  });

  if (!routes.length) {
    throw new Error("Tidak ada route yang ditemukan di src/app.");
  }

  const browser = await chromium.launch();
  const results = [];

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      deviceScaleFactor: 1,
    });
    const loginState = await loginContext(context);

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const failedRequests = [];
      const issues = [];

      page.on("console", (message) => {
        if (message.type() === "error") {
          consoleErrors.push(message.text().slice(0, 220));
        }
      });

      page.on("requestfailed", (request) => {
        const url = request.url();
        if (/\.(png|jpg|jpeg|webp|svg|ico|woff2?)($|\?)/i.test(url)) return;
        failedRequests.push(`${request.method()} ${url} (${request.failure()?.errorText || "failed"})`);
      });

      if (loginState.mode !== "real-login") {
        await seedAuth(page);
        issues.push(`Login real gagal, memakai seed auth: ${loginState.message}`);
      }

      const url = new URL(route, baseURL).toString();
      let response = null;
      let layout = null;
      const screenshotPath = path.join("screenshots", screenshotName(route, viewport));

      try {
        response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15_000 });
        await page.waitForLoadState("networkidle", { timeout: 2_000 }).catch(() => {});
        await page.waitForTimeout(800);
        layout = await inspectLayout(page);

        if (!response || response.status() >= 400) {
          issues.push(`HTTP status ${response?.status() ?? "unknown"}`);
        }
        if (layout.path === "/auth/sign-in" && route !== "/auth/sign-in") {
          issues.push("Redirect ke login, seed auth tidak cukup untuk route ini");
        }
        if (layout.horizontalOverflow > 2) {
          issues.push(`Document horizontal overflow ${layout.horizontalOverflow}px`);
        }
        if (layout.offenders.length) {
          issues.push(`${layout.offenders.length} elemen tampak keluar viewport`);
        }
        if (consoleErrors.length) {
          issues.push(`${consoleErrors.length} console error`);
        }
        if (failedRequests.length) {
          issues.push(`${failedRequests.length} request gagal`);
        }

        await page.screenshot({ path: path.join(outDir, screenshotPath), fullPage: true });
      } catch (error) {
        issues.push(error instanceof Error ? error.message : String(error));
        await page.screenshot({ path: path.join(outDir, screenshotPath), fullPage: true }).catch(() => {});
      }

      results.push({
        route,
        viewport,
        ok: issues.length === 0,
        status: response?.status() ?? null,
        finalPath: page.url() ? new URL(page.url()).pathname : null,
        issues,
        consoleErrors,
        failedRequests,
        layout,
        screenshot: screenshotPath,
        loginState,
      });

      await page.close();
    }

    await context.close();
  }

  await browser.close();

  writeFileSync(path.join(outDir, "results.json"), JSON.stringify(results, null, 2));
  writeFileSync(path.join(outDir, "index.html"), renderHtml(results));

  const failed = results.filter((result) => !result.ok);
  console.log(`Responsive audit selesai: ${results.length - failed.length}/${results.length} lolos.`);
  console.log(`Report: ${path.join(outDir, "index.html")}`);

  if (failed.length) {
    console.log("\nIssue teratas:");
    for (const result of failed.slice(0, 20)) {
      console.log(`- ${result.viewport.name} ${result.route}: ${result.issues.join("; ")}`);
    }
    process.exitCode = 1;
  }
}

audit().catch((error) => {
  console.error(error);
  process.exit(1);
});
