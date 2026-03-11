"use client";

import React, { useMemo } from "react";
import Barcode from "react-barcode";
import { Printer, X, Package } from "lucide-react";
import { Item } from "@/types/inventory";
import { formatNumber } from "@/utils/format-number";

interface BarcodeExportModalProps {
  items: Item[];
  onClose: () => void;
}

export function BarcodeExportModal({ items, onClose }: BarcodeExportModalProps) {
  // Hanya tampilkan sparepart (bukan Service) yang punya SKU
  const sparepartItems = useMemo(
    () => items.filter((item) => item.category !== "Service" && item.sku),
    [items],
  );

  const handlePrint = () => {
    window.print();
  };

  if (sparepartItems.length === 0) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm no-print-overlay">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl dark:bg-gray-dark">
          <Package size={48} className="mx-auto mb-4 text-dark-5 opacity-30" />
          <p className="font-bold text-dark dark:text-white">
            Tidak ada sparepart
          </p>
          <p className="mt-1 text-sm text-dark-5">
            Tidak ada item sparepart dalam daftar yang dipilih.
          </p>
          <button
            onClick={onClose}
            className="mt-6 rounded-xl border border-stroke px-6 py-2.5 text-sm font-bold text-dark-5 hover:border-dark hover:text-dark"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Print Styles ─────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #barcode-export-print,
          #barcode-export-print * { visibility: visible !important; }
          #barcode-export-print {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            padding: 10mm !important;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ── Modal Overlay ────────────────────────────────────── */}
      <div className="no-print-overlay fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm">
        <div className="flex h-full flex-col bg-white dark:bg-gray-dark">
          {/* Header */}
          <div className="no-print flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Export Barcode PDF
              </h3>
              <p className="text-xs text-dark-5">
                {sparepartItems.length} barcode siap dicetak
                {items.length !== sparepartItems.length && (
                  <span className="ml-1 text-dark-5/60">
                    ({items.length - sparepartItems.length} item jasa
                    diabaikan)
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-dark/90"
              >
                <Printer size={16} />
                Cetak / Simpan PDF
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Barcode Grid — scrollable preview + printed content */}
          <div className="flex-1 overflow-y-auto bg-gray-1 p-6 dark:bg-dark-2">
            <div
              id="barcode-export-print"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 print:gap-3"
            >
              {sparepartItems.map((item) => (
                <BarcodeLabel key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="no-print flex items-center justify-between border-t border-stroke px-6 py-4 dark:border-dark-3">
            <p className="text-xs text-dark-5">
              Tip: Pilih &quot;Save as PDF&quot; saat dialog print muncul untuk menyimpan
              sebagai file PDF.
            </p>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-dark/90"
            >
              <Printer size={16} />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Single Barcode Label ─────────────────────────────────────────────────────

function BarcodeLabel({ item }: { item: Item }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-stroke bg-white p-3 text-black shadow-sm print:border print:border-gray-300 print:shadow-none">
      {/* Shop header */}
      <div className="mb-1 w-full text-center">
        <p className="text-[9px] font-black uppercase tracking-tight">
          BENGKEL AUTOSERVICE
        </p>
        <p className="border-b border-black/10 pb-1 text-[8px] font-bold uppercase tracking-widest text-gray-400">
          Premium Garage
        </p>
      </div>

      {/* Barcode */}
      <div className="my-1">
        <Barcode
          value={item.sku}
          width={1.2}
          height={40}
          fontSize={9}
          background="transparent"
          margin={0}
        />
      </div>

      {/* Item info */}
      <div className="w-full text-center">
        <p className="truncate text-[9px] font-bold uppercase leading-tight">
          {item.name}
        </p>
        <p className="mt-0.5 text-[10px] font-black text-gray-700">
          Rp {formatNumber(item.price)}
        </p>
      </div>
    </div>
  );
}
