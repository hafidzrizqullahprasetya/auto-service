/**
 * Print utility — clones a DOM element into a clean print window
 * so content inside modals (overflow:hidden) is never clipped.
 *
 * @param elementId  id of the element to print
 * @param pageTitle  document title shown in browser print header
 * @param extraStyles additional CSS string injected into the print window
 */
export function printElement(
  elementId: string,
  pageTitle = "AutoService — Cetak",
  extraStyles = ""
): void {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`[printElement] Element #${elementId} not found`);
    return;
  }

  // Collect all <link rel="stylesheet"> and <style> from current page
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((link) => link.outerHTML)
    .join("\n");

  const styleTags = Array.from(document.querySelectorAll("style"))
    .map((s) => s.outerHTML)
    .join("\n");

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  printWindow.document.write(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  ${styleLinks}
  ${styleTags}
  <style>
    @page {
      size: A4 portrait;
      margin: 16mm 14mm;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      background: white;
      color: black;
      font-family: 'Inter', 'Satoshi', sans-serif;
    }
    .no-print, .no-print-overlay, .no-print-interactive {
      display: none !important;
    }
    ${extraStyles}
  </style>
</head>
<body>
  ${el.outerHTML}
</body>
</html>
`);

  printWindow.document.close();

  // Wait for styles/images to load before printing
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    // Close after print dialog closes (small delay for Safari)
    setTimeout(() => printWindow.close(), 500);
  };
}
