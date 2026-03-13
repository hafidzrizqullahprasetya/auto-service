"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Icons } from "@/components/Icons";
import { formatNumber } from "@/utils/format-number";
import { ActionButton } from "@/features/shared";
import { Badge } from "@/features/shared";
import { Notify } from "@/utils/notify";

interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  categories?: { name: string };
}

export function LaporanStok() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<LowStockItem[]>("/reports/low-stock");
      setItems(data || []);
    } catch (err) {
      console.error("Failed to fetch low stock", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (items.length === 0) {
      Notify.alert("Tidak ada data", "Tidak ada barang yang perlu diorder ulang saat ini.", "info");
      return;
    }
    window.print();
  };

  return (
    <div className="rounded-lg border border-stroke bg-white p-6 shadow-none dark:border-dark-3 dark:bg-gray-dark">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-dark dark:text-white flex items-center gap-2">
            <Icons.History size={16} className="text-red-500" />
            Daftar Reorder (Stok Menipis)
          </h3>
          <p className="mt-1 text-[11px] font-medium text-dark-5">
            Daftar sparepart yang sudah mencapai atau di bawah batas minimum
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton 
            variant="outline" 
            label="Refresh" 
            icon={<Icons.RefreshCcw size={14} />} 
            onClick={fetchData}
            disabled={loading}
          />
          <ActionButton 
             variant="primary" 
             label="Cetak Surat Pesanan" 
             icon={<Icons.Print size={14} />} 
             onClick={handlePrint}
             disabled={loading || items.length === 0}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stroke dark:border-dark-3 text-[11px] font-bold uppercase text-dark-5 tracking-wider">
              <th className="py-3 px-1">SKU</th>
              <th className="py-3 px-1">Nama Barang</th>
              <th className="py-3 text-center">Stok</th>
              <th className="py-3 text-center">Min. Stok</th>
              <th className="py-3 text-center">Defisit</th>
              <th className="py-3 text-right">Rekomendasi Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="py-4 h-12 bg-gray-1 dark:bg-dark-2 rounded-lg my-1"></td>
                </tr>
              ))
            ) : items.length > 0 ? (
              items.map((item) => {
                const deficit = item.minimum_stock - item.current_stock;
                const recommendation = deficit + Math.ceil(item.minimum_stock * 0.5); // Buffer 50%
                return (
                  <tr key={item.id} className="text-sm hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors group">
                    <td className="py-4 px-1 font-mono text-xs text-dark dark:text-white">{item.sku}</td>
                    <td className="py-4 px-1">
                      <p className="font-bold text-dark dark:text-white leading-tight">{item.name}</p>
                      <p className="text-[10px] text-dark-5 mt-0.5">{item.categories?.name || "Uncategorized"}</p>
                    </td>
                    <td className="py-4 text-center">
                       <span className="font-black text-red-500">{item.current_stock}</span>
                       <span className="text-[10px] text-dark-5 ml-1">{item.unit}</span>
                    </td>
                    <td className="py-4 text-center text-dark-5 font-medium">{item.minimum_stock}</td>
                    <td className="py-4 text-center">
                       <Badge variant="danger">-{deficit}</Badge>
                    </td>
                    <td className="py-4 text-right">
                       <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary border border-primary/20">
                         {recommendation} {item.unit}
                       </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-full bg-green/10 flex items-center justify-center text-green">
                      <Icons.Success size={24} />
                    </div>
                    <p className="text-sm font-bold text-dark dark:text-white">Stok Terjaga</p>
                    <p className="text-xs text-dark-5">Semua sparepart masih di atas batas minimum.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Print-only CSS style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
          }
          .printable-report, .printable-report * {
            visibility: visible;
          }
          .printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 40px;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2 !important;
            color: black !important;
          }
        }
      `}</style>

      {/* Hidden container for printing */}
      <div className="printable-report hidden print:block">
         <div className="text-center mb-8 border-b-2 border-dark pb-4">
            <h1 className="text-2xl font-black uppercase tracking-widest text-dark">Surat Pesanan Sparepart (Reorder)</h1>
            <p className="text-sm font-bold text-dark-5 mt-1 tracking-tighter">AutoService System • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
         </div>
         
         <div className="mb-6 grid grid-cols-2 gap-8 text-sm">
            <div>
               <p className="font-bold text-dark-5 uppercase text-[10px] mb-1">Kepada Yth,</p>
               <p className="font-black text-dark text-base border-b border-stroke pb-1 mb-2">Supplier Sparepart / Toko</p>
               <p className="text-dark-5 italic">Harap kirimkan barang-barang berikut sesuai dengan rekomendasi jumlah di bawah ini.</p>
            </div>
            <div className="text-right">
               <p className="font-bold text-dark-5 uppercase text-[10px] mb-1">Pengirim,</p>
               <p className="font-black text-dark text-base">AutoService Workshop</p>
               <p className="text-dark-5 italic">Bagian Logistik/Gudang</p>
            </div>
         </div>

         <table className="w-full mt-4">
            <thead>
               <tr>
                  <th>No</th>
                  <th>SKU</th>
                  <th>Nama Barang</th>
                  <th>Stok Saat Ini</th>
                  <th>Jumlah Order (Rekomendasi)</th>
                  <th>Catatan</th>
               </tr>
            </thead>
            <tbody>
               {items.map((item, idx) => {
                  const deficit = item.minimum_stock - item.current_stock;
                  const recommendation = deficit + Math.ceil(item.minimum_stock * 0.5);
                  return (
                    <tr key={item.id}>
                       <td className="text-center">{idx + 1}</td>
                       <td>{item.sku}</td>
                       <td><span className="font-bold">{item.name}</span></td>
                       <td className="text-center">{item.current_stock} {item.unit}</td>
                       <td className="text-center font-black">{recommendation} {item.unit}</td>
                       <td></td>
                    </tr>
                  )
               })}
            </tbody>
         </table>

         <div className="mt-12 flex justify-between items-end">
            <div className="text-center w-48">
               <p className="text-[10px] font-bold uppercase mb-16 text-dark-5">Hormat Kami,</p>
               <div className="border-t border-dark pt-1 font-bold">( ............................ )</div>
               <p className="text-[10px]">Petugas Gudang</p>
            </div>
            <div className="text-center w-48">
               <p className="text-[10px] font-bold uppercase mb-16 text-dark-5">Menyetujui,</p>
               <div className="border-t border-dark pt-1 font-bold">( ............................ )</div>
               <p className="text-[10px]">Manager / Owner</p>
            </div>
         </div>
      </div>
    </div>
  );
}
