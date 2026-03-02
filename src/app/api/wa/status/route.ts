/**
 * API Route: GET /api/wa/status
 * Returns current WA connection status & QR code data
 */
import { NextResponse } from "next/server";
import { getConnectionStatus, getQRCode, isWAReady } from "@/lib/wa-service";

export async function GET() {
  return NextResponse.json({
    status: getConnectionStatus(),
    isReady: isWAReady(),
    hasQR: !!getQRCode(),
  });
}
