"use client";

import React, { useState } from "react";
import { Icons } from "@/components/Icons";
import { Transaction } from "@/types/transaction";
import { formatNumber } from "@/utils/format-number";
import { Notify } from "@/utils/notify";
import dayjs from "dayjs";
import { printElement } from "@/utils/print";

interface InvoiceModalProps {
  transaction: Transaction;
  onClose: () => void;
}

import { ActionButton, BaseModal } from "@/features/shared";

export function InvoiceModal({ transaction, onClose }: InvoiceModalProps) {
  const [sendingWA, setSendingWA] = useState(false);

  const handlePrint = () => {
    printElement("invoice-content", `Invoice — ${transaction.invoiceNo}`);
  };

  const sendInvoiceViaWA = async () => {
    if (!transaction.customerPhone) {
      Notify.toast("Nomor pelanggan tidak tersedia", "warning");
      return;
    }

    try {
      setSendingWA(true);

      // Format invoice message
      const itemsList = transaction.items
        .map(
          (item) =>
            `• ${item.name}\n  Qty: ${item.qty} x Rp ${formatNumber(item.price)} = Rp ${formatNumber(item.price * item.qty)}`,
        )
        .join("\n\n");

      const invoiceMessage = `
*NOTA SERVIS AUTOSERVICE*

📋 *Invoice: ${transaction.invoiceNo}*
📅 ${dayjs(transaction.date).format("DD MMMM YYYY | HH:mm")}

*PELANGGAN:*
${transaction.customerName}

*KENDARAAN:*
${transaction.vehiclePlate} (${transaction.type})

*DETAIL PEKERJAAN:*
${itemsList}
${transaction.notes ? `\n*CATATAN SERVIS:*\n${transaction.notes}` : ""}

*RINGKASAN BIAYA:*
Subtotal: Rp ${formatNumber(transaction.subtotal)}
PPN (${transaction.taxPercentage}%): Rp ${formatNumber(transaction.tax)}
━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: Rp ${formatNumber(transaction.total)}*

*METODE PEMBAYARAN:* ${transaction.paymentMethod}
*STATUS:* ${transaction.paymentStatus}

✅ Terima kasih telah mempercayakan kendaraan Anda di AutoService Premium Garage!

📞 Hubungi kami: +62 812-3456-7890
      `.trim();

      // Format phone number
      const phoneNumber = transaction.customerPhone.startsWith("+")
        ? transaction.customerPhone
        : `+62${transaction.customerPhone.startsWith("0") ? transaction.customerPhone.slice(1) : transaction.customerPhone}`;

      // Send via Bot API
      const { api } = await import("@/lib/api");
      await api.post("/api/v1/notifications/wa/send", {
        phone: phoneNumber,
        message: invoiceMessage,
      });

      Notify.toast("Pesan telah masuk antrean Bot!", "success", "top");
    } catch (error: any) {
      Notify.alert("Gagal Kirim", error.message || "Gagal mengirim via Bot", "error");
      console.error(error);
    } finally {
      setSendingWA(false);
    }
  };

  return (
    <BaseModal
      title="Digital Invoice"
      description={`#${transaction.invoiceNo}`}
      icon={<Icons.Whatsapp size={20} className="text-[#25D366]" />}
      onClose={onClose}
      maxWidth="2xl"
      footer={
        <div className="no-print flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={sendInvoiceViaWA}
            disabled={sendingWA || !transaction.customerPhone}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-stroke bg-white px-5 py-2.5 text-sm font-bold text-dark transition-colors hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <Icons.Whatsapp className="size-4 text-[#25D366]" />
            {sendingWA ? "Mengirim..." : "Kirim Invoice (WA)"}
          </button>
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-opacity-90"
          >
            <Icons.Print size={18} />
            Cetak Invoice (A4/Thermal)
          </button>
        </div>
      }
    >
      <div
        id="invoice-content"
        className="space-y-8 bg-white text-black print:p-8 print:max-w-[190mm] print:mx-auto"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b-2 border-dark pb-6 sm:flex-row">
          <div className="flex flex-col">
            <h1 className="flex items-center text-2xl font-black tracking-tight text-dark">
              AUTO<span className="ml-0.5 italic text-secondary">SERVICE</span>
            </h1>
            <p className="text-[10px] font-bold text-dark-5">
              Premium Garage & Spareparts
            </p>
            <div className="mt-4 max-w-[200px] text-xs font-medium text-gray-600">
              Jl. Otomotif No. 123, Indonesia
              <br />
              WhatsApp: +62 812-3456-7890
              <br />
              service@autoservice.com
            </div>
          </div>
          <div className="flex flex-col text-right sm:items-end">
            <div className="mb-2 inline-block rounded-lg bg-dark px-4 py-2 text-white">
              <h2 className="text-xl font-bold tracking-wider">INVOICE</h2>
            </div>
            <p className="text-sm font-bold text-dark">
              {transaction.invoiceNo}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {dayjs(transaction.date).format("DD MMMM YYYY | HH:mm")}
            </p>
          </div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div>
            <p className="text-[10px] font-bold text-gray-400">
              Diberikan Kepada:
            </p>
            <h4 className="text-base font-bold text-dark">
              {transaction.customerName}
            </h4>
            <p className="text-xs font-medium text-gray-600">
              Pelanggan Setia AutoService
            </p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-bold text-gray-400">
              Detail Kendaraan:
            </p>
            <h4 className="text-base font-bold text-secondary">
              {transaction.vehiclePlate}
            </h4>
            <p className="text-xs font-medium text-gray-600">
              {transaction.type}
            </p>
          </div>
        </div>

        {/* Notes / Catatan Servis */}
        {transaction.notes && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 print:border-gray-200 print:bg-gray-50">
            <span className="mt-0.5 text-amber-500 print:text-gray-500">📝</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 print:text-gray-500">
                Catatan Servis
              </p>
              <p className="mt-0.5 text-sm font-medium text-gray-700">
                {transaction.notes}
              </p>
            </div>
          </div>
        )}

        {/* Items Table */}
        <table className="w-full">
          <thead className="border-b border-dark">
            <tr className="border-b border-dark text-dark [&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:font-bold">
              <th>Deskripsi Pekerjaan / Part</th>
              <th className="w-20 text-center">Qty</th>
              <th className="w-32 text-right">Harga Satuan</th>
              <th className="w-32 text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transaction.items.map((item, idx) => (
              <tr key={idx} className="text-dark [&>td]:py-4 [&>td]:text-sm">
                <td className="font-bold">{item.name}</td>
                <td className="text-center font-medium">{item.qty}</td>
                <td className="text-right tabular-nums">
                  Rp {formatNumber(item.price)}
                </td>
                <td className="text-right font-bold tabular-nums">
                  Rp {formatNumber(item.price * item.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end pt-6">
          <div className="w-full space-y-2 border-t border-dark pt-4 sm:w-64">
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>Subtotal</span>
              <span className="text-dark">
                Rp {formatNumber(transaction.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500">
              <span>PPN ({transaction.taxPercentage}%)</span>
              <span className="text-dark">
                Rp {formatNumber(transaction.tax)}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-dotted border-gray-200 pt-2 text-lg font-bold text-dark">
              <span>Total Pelunasan</span>
              <span className="tracking-tighter text-secondary">
                Rp {formatNumber(transaction.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Receipt */}
        <div className="mt-12 space-y-4 text-center">
          <div className="inline-block rounded-lg border-2 border-dotted border-gray-300 px-6 py-2">
            <p className="text-xs font-bold text-gray-500">Metode Pembayaran</p>
            <p className="flex items-center justify-center gap-2 text-base font-bold text-dark">
              <Icons.Success className="size-4 text-green" />
              {transaction.paymentMethod} — {transaction.paymentStatus}
            </p>
          </div>
          <p className="text-[10px] font-medium italic text-gray-400">
            "Terima kasih telah mempercayakan kendaraan Anda di AutoService
            Premium Garage."
          </p>
        </div>
      </div>

    </BaseModal>
  );
}
