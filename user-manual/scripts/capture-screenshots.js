const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

const ROOT_DIR = path.resolve(__dirname, "../..");
const OUTPUT_DIR = path.join(ROOT_DIR, "user-manual", "images", "autoservice");
const BASE_URL = (process.env.MANUAL_BASE_URL || "http://localhost:3333").replace(/\/+$/, "");

const CREDENTIALS = {
  owner: {
    username: process.env.MANUAL_OWNER_USER || "owner",
    password: process.env.MANUAL_OWNER_PASS || "owner123",
  },
  admin: {
    username: process.env.MANUAL_ADMIN_USER || "admin",
    password: process.env.MANUAL_ADMIN_PASS || "admin123",
  },
  kasir: {
    username: process.env.MANUAL_KASIR_USER || "kasir",
    password: process.env.MANUAL_KASIR_PASS || "kasir123",
  },
  mekanik: {
    username: process.env.MANUAL_MEKANIK_USER || "mekanik",
    password: process.env.MANUAL_MEKANIK_PASS || "mekanik123",
  },
};

const VIEWPORT = { width: 1440, height: 900 };
const RESULTS = [];

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Capture screenshot user manual AutoService.

Usage:
  npm run manual:screenshots

Environment:
  MANUAL_BASE_URL=http://localhost:3333
  MANUAL_OWNER_USER=owner
  MANUAL_OWNER_PASS=owner123
  MANUAL_ADMIN_USER=admin
  MANUAL_ADMIN_PASS=admin123
  MANUAL_KASIR_USER=kasir
  MANUAL_KASIR_PASS=kasir123
  MANUAL_MEKANIK_USER=mekanik
  MANUAL_MEKANIK_PASS=mekanik123
`);
  process.exit(0);
}

function filePath(file) {
  return path.join(OUTPUT_DIR, file);
}

async function waitForStablePage(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(900);
}

async function closePopups(page) {
  const closeButtons = [
    page.getByRole("button", { name: /tutup/i }),
    page.locator(".swal2-close"),
    page.locator('[aria-label="Close"]'),
  ];

  for (const button of closeButtons) {
    if (await button.first().isVisible().catch(() => false)) {
      await button.first().click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
}

async function capture(page, file, description, options = {}) {
  await waitForStablePage(page);
  await closePopups(page);

  if (options.scrollTo) {
    await page.evaluate((y) => window.scrollTo(0, y), options.scrollTo);
    await page.waitForTimeout(400);
  }

  await page.screenshot({
    path: filePath(file),
    fullPage: Boolean(options.fullPage),
  });

  RESULTS.push({ file, description, status: "captured" });
  console.log(`captured ${file} - ${description}`);
}

async function skipped(file, description, reason) {
  RESULTS.push({ file, description, status: "skipped", reason });
  console.warn(`skipped ${file} - ${reason}`);
}

async function goto(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded" });
  await waitForStablePage(page);
}

async function clearSession(page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
      return;
    } catch (error) {
      if (attempt === 2) throw error;
      await page.waitForTimeout(500);
    }
  }
}

async function login(page, role) {
  const credential = CREDENTIALS[role];
  await clearSession(page);
  await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: "domcontentloaded" });
  await waitForStablePage(page);
  await page.getByLabel(/username/i).fill(credential.username);
  await page.getByLabel(/password/i).fill(credential.password);
  await page.getByRole("button", { name: /masuk ke dashboard/i }).click();
  await page.waitForURL((url) => !url.pathname.includes("/auth/sign-in"), { timeout: 15000 });
  await waitForStablePage(page);
}

async function captureLoginScreens(page) {
  await clearSession(page);
  await page.goto(`${BASE_URL}/auth/sign-in`, { waitUntil: "domcontentloaded" });
  await capture(page, "01-login.png", "Halaman login kosong");

  await page.getByLabel(/username/i).fill(CREDENTIALS.owner.username);
  await page.getByLabel(/password/i).fill(CREDENTIALS.owner.password);
  await capture(page, "02-login-filled.png", "Halaman login dengan contoh kredensial");
}

async function clickFirstVisible(page, candidates) {
  for (const candidate of candidates) {
    const locator = typeof candidate === "string" ? page.locator(candidate) : candidate;
    const first = locator.first();
    if (await first.isVisible().catch(() => false)) {
      await first.click();
      await waitForStablePage(page);
      return true;
    }
  }
  return false;
}

async function captureModalFromAction(page, file, description, actionCandidates) {
  const opened = await clickFirstVisible(page, actionCandidates);
  if (!opened) {
    await skipped(file, description, "action button tidak ditemukan");
    return;
  }

  await capture(page, file, description);
  await page.keyboard.press("Escape").catch(() => {});
  await waitForStablePage(page);
}

async function captureDashboard(page) {
  await login(page, "owner");
  await goto(page, "/");
  await capture(page, "03-dashboard-overview.png", "Dashboard utama owner");
  await capture(page, "04-dashboard-revenue.png", "Grafik pendapatan dashboard", { scrollTo: 260 });
  await capture(page, "05-dashboard-vehicle-ratio.png", "Rasio kendaraan dan stok rendah", { scrollTo: 620 });
  await capture(page, "06-owner-sidebar-full.png", "Sidebar lengkap owner");
}

async function captureQueueAdmin(page) {
  await login(page, "admin");
  await goto(page, "/antrean");
  await capture(page, "07-antrean-summary.png", "Ringkasan antrean servis");
  await capture(page, "08-antrean-table.png", "Tabel antrean servis");

  await clickFirstVisible(page, [page.getByRole("button", { name: /kanban board/i })]);
  await capture(page, "09-antrean-kanban.png", "Kanban antrean servis");

  await goto(page, "/antrean?modal=create");
  await capture(page, "10-work-order-create.png", "Form entry work order");

  await goto(page, "/antrean");
  await captureModalFromAction(page, "11-work-order-edit.png", "Form ubah work order", [
    page.getByTitle(/edit/i),
    page.getByTitle(/ubah/i),
    page.getByRole("button", { name: /ubah detail/i }),
  ]);

  await goto(page, "/antrean");
  await captureModalFromAction(page, "12-spk-preview.png", "Preview cetak SPK", [
    page.getByTitle(/cetak spk/i),
    page.getByRole("button", { name: /cetak spk/i }),
  ]);

  await goto(page, "/antrean");
  const inspectionActions = [
    page.getByTitle(/checklist inspeksi/i),
    page.getByRole("button", { name: /checklist inspeksi/i }),
  ];
  const opened = await clickFirstVisible(page, inspectionActions);
  if (!opened) {
    await skipped("13-inspection-header.png", "Header inspection checklist", "tombol checklist tidak ditemukan");
    await skipped("14-inspection-engine.png", "Pengecekan area mesin", "tombol checklist tidak ditemukan");
    await skipped("15-inspection-cabin.png", "Pengecekan area dalam kabin", "tombol checklist tidak ditemukan");
    await skipped("16-inspection-exterior-notes.png", "Eksterior dan catatan inspection", "tombol checklist tidak ditemukan");
    return;
  }

  await capture(page, "13-inspection-header.png", "Header inspection checklist");
  await capture(page, "14-inspection-engine.png", "Pengecekan area mesin", { scrollTo: 360 });
  await capture(page, "15-inspection-cabin.png", "Pengecekan area dalam kabin", { scrollTo: 760 });
  await capture(page, "16-inspection-exterior-notes.png", "Eksterior, understel, dan catatan", { scrollTo: 1160 });
}

async function captureCashier(page) {
  await login(page, "kasir");
  await goto(page, "/kasir");
  await capture(page, "17-kasir-transaction-list.png", "Daftar transaksi kasir");

  await captureModalFromAction(page, "18-kasir-create-transaction.png", "Form transaksi baru", [
    page.getByRole("button", { name: /transaksi baru/i }),
    page.getByRole("button", { name: /buat transaksi/i }),
    page.getByRole("button", { name: /tambah/i }),
  ]);

  await goto(page, "/antrean");
  await captureModalFromAction(page, "19-kasir-from-work-order.png", "Aksi pembayaran dari work order", [
    page.getByTitle(/bayar/i),
    page.getByTitle(/kasir/i),
  ]);

  await goto(page, "/kasir");
  await captureModalFromAction(page, "20-invoice-preview.png", "Preview invoice", [
    page.getByTitle(/invoice/i),
    page.getByTitle(/print/i),
    page.getByRole("button", { name: /invoice/i }),
  ]);
}

async function captureInventory(page) {
  await login(page, "admin");

  await goto(page, "/inventori");
  await capture(page, "21-inventory-list.png", "Daftar sparepart");
  await captureModalFromAction(page, "22-inventory-add-item.png", "Form sparepart", [
    page.getByRole("button", { name: /tambah/i }),
    page.getByRole("button", { name: /item/i }),
  ]);
  await captureModalFromAction(page, "23-inventory-barcode.png", "Barcode sparepart", [
    page.getByTitle(/barcode/i),
    page.getByRole("button", { name: /barcode/i }),
  ]);

  await goto(page, "/inventori/kategori");
  await capture(page, "24-inventory-category-unit.png", "Kategori dan satuan sparepart");
  await captureModalFromAction(page, "25-inventory-category-form.png", "Form kategori sparepart", [
    page.getByRole("button", { name: /tambah/i }),
    page.getByRole("button", { name: /kategori/i }),
  ]);

  await goto(page, "/inventori/stok");
  await capture(page, "26-stock-movement-list.png", "Riwayat stok masuk dan keluar");
  await captureModalFromAction(page, "27-stock-movement-form.png", "Form stok masuk atau keluar", [
    page.getByRole("button", { name: /stok masuk/i }),
    page.getByRole("button", { name: /stok keluar/i }),
    page.getByRole("button", { name: /tambah/i }),
  ]);

  await goto(page, "/inventori/opname");
  await capture(page, "28-stock-opname-session.png", "Sesi stock opname");
  await captureModalFromAction(page, "29-stock-opname-items.png", "Item stock opname", [
    page.getByRole("button", { name: /detail/i }),
    page.getByRole("button", { name: /lihat/i }),
    page.getByRole("row").nth(1),
  ]);
}

async function captureMasterData(page) {
  await login(page, "admin");

  await goto(page, "/pelanggan");
  await capture(page, "30-customer-list.png", "Daftar pelanggan");
  await captureModalFromAction(page, "31-customer-form.png", "Form pelanggan", [
    page.getByRole("button", { name: /tambah/i }),
    page.getByRole("button", { name: /pelanggan/i }),
  ]);

  await goto(page, "/kendaraan");
  await capture(page, "32-vehicle-list.png", "Daftar kendaraan");
  await captureModalFromAction(page, "33-vehicle-form.png", "Form kendaraan", [
    page.getByRole("button", { name: /tambah/i }),
    page.getByRole("button", { name: /kendaraan/i }),
  ]);

  await goto(page, "/katalog-jasa");
  await capture(page, "34-service-catalog-list.png", "Katalog jasa dan paket");
  await captureModalFromAction(page, "35-service-catalog-form.png", "Form jasa atau paket servis", [
    page.getByRole("button", { name: /tambah/i }),
    page.getByRole("button", { name: /jasa/i }),
    page.getByRole("button", { name: /paket/i }),
  ]);
}

async function captureReportsAndSettings(page) {
  await login(page, "owner");

  await goto(page, "/reminder");
  await capture(page, "36-reminder-list.png", "Reminder follow-up servis");

  await goto(page, "/laporan");
  await capture(page, "37-report-tabs.png", "Tab laporan AutoService");

  await goto(page, "/pengaturan?tab=bengkel");
  await capture(page, "38-settings-profile.png", "Pengaturan profil bengkel");

  await goto(page, "/pengaturan?tab=akun");
  await capture(page, "39-settings-accounts-permissions.png", "Manajemen akun dan permission");
}

async function captureMechanic(page) {
  await login(page, "mekanik");
  await goto(page, "/antrean");
  await capture(page, "40-mechanic-queue-inspection.png", "Tampilan mekanik untuk antrean dan checklist");
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("console", (msg) => console.log(`[BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => console.error(`[BROWSER ERROR] ${err.message}`));
  page.setDefaultTimeout(Number(process.env.MANUAL_TIMEOUT_MS || 12000));

  try {
    await captureLoginScreens(page);
    await captureDashboard(page);
    await captureQueueAdmin(page);
    await captureCashier(page);
    await captureInventory(page);
    await captureMasterData(page);
    await captureReportsAndSettings(page);
    await captureMechanic(page);
  } catch (error) {
    await page.screenshot({ path: path.join(OUTPUT_DIR, "error-timeout.png") }).catch(() => {});
    console.error("SAVED TIMEOUT SCREENSHOT TO error-timeout.png");
    throw error;
  } finally {
    await browser.close();
  }

  const reportPath = path.join(OUTPUT_DIR, "capture-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify({ baseUrl: BASE_URL, results: RESULTS }, null, 2)}\n`);

  const captured = RESULTS.filter((result) => result.status === "captured").length;
  const skippedCount = RESULTS.filter((result) => result.status === "skipped").length;
  console.log(`\nDone. Captured: ${captured}. Skipped: ${skippedCount}.`);
  console.log(`Report: ${reportPath}`);

  if (skippedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
