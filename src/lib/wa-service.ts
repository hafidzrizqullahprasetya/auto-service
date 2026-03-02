/**
 * WhatsApp Service — menggunakan whatsapp-web.js (open source)
 * Jalankan di Node.js server / Next.js API route
 * 
 * PENTING: whatsapp-web.js butuh Puppeteer (headless Chrome).
 * Di production, pastikan server punya Chrome/Chromium installed.
 */

import { Client, LocalAuth, type Message } from "whatsapp-web.js";

// ─── Singleton instance ───────────────────────────────────────────────────────
let waClient: Client | null = null;
let isReady = false;
let qrCodeData: string | null = null;
let connectionStatus: "disconnected" | "connecting" | "qr_ready" | "authenticated" | "ready" =
  "disconnected";

// ─── Event callbacks (UI bisa subscribe) ──────────────────────────────────────
type StatusCallback = (status: typeof connectionStatus, qr?: string) => void;
const statusListeners: StatusCallback[] = [];

export function onStatusChange(cb: StatusCallback) {
  statusListeners.push(cb);
  return () => {
    const idx = statusListeners.indexOf(cb);
    if (idx !== -1) statusListeners.splice(idx, 1);
  };
}

function emit(status: typeof connectionStatus, qr?: string) {
  connectionStatus = status;
  statusListeners.forEach((cb) => cb(status, qr));
}

// ─── Init client ─────────────────────────────────────────────────────────────
export function initWAClient(): Client {
  if (waClient) return waClient;

  waClient = new Client({
    authStrategy: new LocalAuth({
      clientId: "auto-service-bengkel",
      dataPath: ".wwebjs_auth",
    }),
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
  });

  // ── Events ──
  waClient.on("qr", (qr: string) => {
    qrCodeData = qr;
    emit("qr_ready", qr);
    console.log("[WA] QR Code siap — scan dengan WhatsApp kamu.");
  });

  waClient.on("authenticated", () => {
    emit("authenticated");
    console.log("[WA] Authenticated berhasil.");
  });

  waClient.on("ready", () => {
    isReady = true;
    qrCodeData = null;
    emit("ready");
    console.log("[WA] Client siap kirim pesan.");
  });

  waClient.on("disconnected", (reason: string) => {
    isReady = false;
    waClient = null;
    emit("disconnected");
    console.log("[WA] Disconnected:", reason);
  });

  waClient.on("message", (msg: Message) => {
    // Handle incoming messages jika diperlukan
    console.log("[WA] Pesan masuk dari:", msg.from, "—", msg.body);
  });

  emit("connecting");
  waClient.initialize();
  return waClient;
}

// ─── Kirim pesan ──────────────────────────────────────────────────────────────
export async function sendWAMessage(
  phoneNumber: string,
  message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!waClient || !isReady) {
    return { success: false, error: "WA client belum siap. Silakan scan QR terlebih dahulu." };
  }

  // Format nomor → harus "628xxx@c.us"
  const formatted = formatPhoneNumber(phoneNumber);

  try {
    const sentMsg = await waClient.sendMessage(formatted, message);
    return { success: true, messageId: sentMsg.id._serialized };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error("[WA] Gagal kirim pesan:", error);
    return { success: false, error };
  }
}

// ─── Kirim notifikasi stok menipis ──────────────────────────────────────────
export async function sendLowStockAlert(
  phoneNumber: string,
  items: Array<{ name: string; sku: string; stock: number; minimumStock: number }>
): Promise<{ success: boolean; error?: string }> {
  const bengkelName = "Auto Service";
  const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  const itemList = items
    .map(
      (item, i) =>
        `${i + 1}. *${item.name}* (${item.sku})\n   Stok: ${item.stock} / Min: ${item.minimumStock}`
    )
    .join("\n");

  const message = [
    `⚠️ *PERINGATAN STOK MENIPIS*`,
    `🏪 ${bengkelName}`,
    `📅 ${now}`,
    ``,
    `Sparepart berikut butuh restock segera:`,
    ``,
    itemList,
    ``,
    `_Pesan otomatis dari Sistem Inventory ${bengkelName}_`,
  ].join("\n");

  return sendWAMessage(phoneNumber, message);
}

// ─── Kirim konfirmasi servis selesai ke customer ──────────────────────────────
export async function sendServiceCompletedNotif(
  customerPhone: string,
  customerName: string,
  vehiclePlate: string,
  services: string[]
): Promise<{ success: boolean; error?: string }> {
  const message = [
    `✅ *Servis Selesai!*`,
    ``,
    `Halo *${customerName}*,`,
    `Kendaraan Anda *${vehiclePlate}* telah selesai diservis.`,
    ``,
    `📋 *Layanan yang dikerjakan:*`,
    ...services.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `Silakan ambil kendaraan Anda.`,
    `Terima kasih telah mempercayakan kendaraan Anda kepada kami! 🙏`,
    ``,
    `_Auto Service_`,
  ].join("\n");

  return sendWAMessage(customerPhone, message);
}

// ─── Getters ──────────────────────────────────────────────────────────────────
export function getConnectionStatus() {
  return connectionStatus;
}

export function getQRCode() {
  return qrCodeData;
}

export function isWAReady() {
  return isReady;
}

export async function disconnectWA() {
  if (waClient) {
    await waClient.destroy();
    waClient = null;
    isReady = false;
    emit("disconnected");
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPhoneNumber(phone: string): string {
  // Bersihkan karakter non-digit
  let cleaned = phone.replace(/\D/g, "");

  // Ganti awalan 0 → 62
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  // Pastikan ada kode negara 62
  if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }

  return `${cleaned}@c.us`;
}
