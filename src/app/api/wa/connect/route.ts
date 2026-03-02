/**
 * API Route: POST /api/wa/connect
 * Inisialisasi WA client & kembalikan QR code
 */
import { NextResponse } from "next/server";
import { initWAClient, getQRCode, isWAReady } from "@/lib/wa-service";
import QRCode from "qrcode";

export async function POST() {
  try {
    initWAClient();

    // Tunggu sebentar agar QR terbentuk
    await new Promise((resolve) => setTimeout(resolve, 3000));

    if (isWAReady()) {
      return NextResponse.json({ status: "ready", message: "WA sudah terhubung." });
    }

    const qrRaw = getQRCode();
    if (qrRaw) {
      const qrDataURL = await QRCode.toDataURL(qrRaw, { width: 300, margin: 2 });
      return NextResponse.json({ status: "qr_ready", qrCode: qrDataURL });
    }

    return NextResponse.json({ status: "connecting", message: "Sedang inisialisasi..." });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", error }, { status: 500 });
  }
}
