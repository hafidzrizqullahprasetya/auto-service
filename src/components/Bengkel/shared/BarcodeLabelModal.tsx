"use client";

import React from "react";
import Barcode from "react-barcode";
import { Icons } from "@/components/Icons";
import { Item } from "@/mock/inventory";
import { formatNumber } from "@/lib/format-number";

interface BarcodeLabelModalProps {
  item: Item;
  onClose: () => void;
}

export function BarcodeLabelModal({ item, onClose }: BarcodeLabelModalProps) {
  const printLabel = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print-overlay">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-dark border border-stroke dark:border-dark-3 flex flex-col translate-y-0 opacity-100 transition-all">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icons.Inventory size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-dark dark:text-white">
                Generate Barcode Label
              </h3>
              <p className="text-xs font-medium text-dark-5 dark:text-dark-6 uppercase">
                {item.category} Sparepart
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
          >
            <Icons.Plus size={24} className="rotate-45" />
          </button>
        </div>

        {/* Content - Label Preview */}
        <div className="p-8 flex flex-col items-center justify-center bg-gray-1 dark:bg-dark-3">
          <div 
            id="printable-barcode"
            className="bg-white p-6 rounded-lg shadow-sm border border-dashed border-stroke flex flex-col items-center w-72 h-auto text-black print:shadow-none print:border-none print:m-0 print:p-4"
          >
            <div className="text-center mb-2 w-full">
              <h4 className="text-[12px] font-black uppercase tracking-tighter leading-tight line-clamp-2">
                BENGKEL AUTOSERVICE
              </h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-black/10 pb-1 mb-2">
                Premium Garage
              </p>
            </div>

            <div className="mb-2">
              <Barcode 
                value={item.sku} 
                width={1.5} 
                height={50} 
                fontSize={12}
                background="transparent"
              />
            </div>

            <div className="text-center w-full">
              <p className="text-[10px] font-bold uppercase truncate px-2">{item.name}</p>
              <p className="text-sm font-black text-secondary mt-1">
                Rp {formatNumber(item.price)}
              </p>
            </div>
          </div>
          
          <p className="mt-6 text-xs text-dark-5 text-center max-w-[250px]">
            Preview label di atas akan dicetak sesuai ukuran standar thermal barcode (50mm x 30mm).
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-stroke p-5 dark:border-dark-3 bg-gray-50 dark:bg-dark-2 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 rounded-md border border-stroke bg-white px-5 py-2.5 text-sm font-bold text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white transition-all active:scale-95"
          >
            Batal
          </button>
          <button 
            onClick={printLabel}
            className="flex-1 flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 transition-all active:scale-95 shadow-lg"
          >
            <Icons.Print size={18} />
            Cetak Label
          </button>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-barcode, #printable-barcode * {
            visibility: visible;
          }
          #printable-barcode {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 10px;
            width: 100%;
            height: auto;
            border: none !important;
          }
          .no-print-overlay {
            background: white !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
