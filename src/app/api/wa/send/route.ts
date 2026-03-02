/**
 * API Route: POST /api/wa/send
 * Kirim pesan WA — notif stok atau pesan custom
 */
import { NextRequest, NextResponse } from "next/server";
import { sendWAMessage, sendLowStockAlert } from "@/lib/wa-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, phoneNumber, message, items } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: "phoneNumber wajib diisi." },
        { status: 400 }
      );
    }

    if (type === "low_stock" && items) {
      const result = await sendLowStockAlert(phoneNumber, items);
      return NextResponse.json(result);
    }

    if (message) {
      const result = await sendWAMessage(phoneNumber, message);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: "message atau type low_stock dengan items diperlukan." },
      { status: 400 }
    );
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
