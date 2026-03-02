"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { Transaction } from "@/mock/transactions";
import { formatNumber } from "@/lib/format-number";
import dayjs from "dayjs";

interface InvoiceModalProps {
  transaction: Transaction;
  onClose: () => void;
}

import { ActionButton, BaseModal } from "../shared";

export function InvoiceModal({ transaction, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <BaseModal
      title="Digital Invoice"
      description={`#${transaction.invoiceNo}`}
      icon={<Icons.History size={20} />}
      onClose={onClose}
      maxWidth="2xl"
      footer={
        <div className="flex w-full flex-col sm:flex-row gap-3 no-print">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-md border border-stroke bg-white px-5 py-2.5 text-sm font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition-colors">
            <Icons.Plus className="rotate-45 size-4" />
            Kirim WhatsApp
          </button>
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 transition-colors"
          >
            <Icons.Print size={18} />
            Cetak Invoice (A4/Thermal)
          </button>
        </div>
      }
    >
      <div id="invoice-content" className="space-y-8 bg-white text-black print:p-0">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-dark pb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight flex items-center text-dark">
              AUTO<span className="text-secondary italic ml-0.5">SERVICE</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              Premium Garage & Spareparts
            </p>
            <div className="mt-4 text-xs font-medium text-gray-600 max-w-[200px]">
              Jl. Otomotif No. 123, Indonesia<br />
              WhatsApp: +62 812-3456-7890<br />
              service@autoservice.com
            </div>
          </div>
          <div className="text-right sm:items-end flex flex-col">
            <div className="bg-dark text-white px-4 py-2 rounded-lg mb-2 inline-block">
              <h2 className="text-xl font-black uppercase tracking-widest">INVOICE</h2>
            </div>
            <p className="text-sm font-bold text-dark">{transaction.invoiceNo}</p>
            <p className="text-xs font-medium text-gray-500">{dayjs(transaction.date).format("DD MMMM YYYY | HH:mm")}</p>
          </div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Diberikan Kepada:</p>
            <h4 className="text-base font-black uppercase text-dark">{transaction.customerName}</h4>
            <p className="text-xs font-medium text-gray-600">Pelanggan Setia AutoService</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Detail Kendaraan:</p>
            <h4 className="text-base font-black text-secondary tracking-wider uppercase">{transaction.vehiclePlate}</h4>
            <p className="text-xs font-medium text-gray-600">{transaction.type}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full">
          <thead className="border-b border-dark">
            <tr className="[&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:font-black [&>th]:uppercase [&>th]:tracking-wider text-dark">
              <th>Deskripsi Pekerjaan / Part</th>
              <th className="text-center w-20">Qty</th>
              <th className="text-right w-32">Harga Satuan</th>
              <th className="text-right w-32">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transaction.items.map((item, idx) => (
              <tr key={idx} className="[&>td]:py-4 [&>td]:text-sm text-dark">
                <td className="font-bold">{item.name}</td>
                <td className="text-center font-medium">{item.qty}</td>
                <td className="text-right tabular-nums">Rp {formatNumber(item.price)}</td>
                <td className="text-right font-black tabular-nums">Rp {formatNumber(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end pt-6">
          <div className="w-full sm:w-64 space-y-2 border-t border-dark pt-4">
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
              <span>Subtotal</span>
              <span className="text-dark">Rp {formatNumber(transaction.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
              <span>PPN (11%)</span>
              <span className="text-dark">Rp {formatNumber(transaction.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black border-t-2 border-dotted border-gray-200 pt-2 text-dark">
              <span>TOTAL</span>
              <span className="text-secondary tracking-tighter">Rp {formatNumber(transaction.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer Receipt */}
        <div className="mt-12 text-center space-y-4">
          <div className="inline-block border-2 border-dotted border-gray-300 px-6 py-2 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase">Metode Pembayaran</p>
            <p className="text-base font-black flex items-center justify-center gap-2 text-dark">
              <Icons.Success className="text-green size-4" />
              {transaction.paymentMethod.toUpperCase()} - LUNAS
            </p>
          </div>
          <p className="text-[10px] italic text-gray-400 font-medium">
            "Terima kasih telah mempercayakan kendaraan Anda di AutoService Premium Garage."
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }
          .no-print, .no-print-overlay {
            display: none !important;
          }
        }
      `}</style>
    </BaseModal>
  );
}
