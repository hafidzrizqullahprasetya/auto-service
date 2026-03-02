"use client";

import { Icons } from "@/components/icons";
import { formatNumber } from "@/lib/format-number";
import { MOCK_ITEMS } from "@/mock/inventory";

export function InventorySummary() {
  const totalItems = MOCK_ITEMS.filter(item => item.category !== "Service").length;
  const lowStockItems = MOCK_ITEMS.filter(item => item.stock !== undefined && item.stock < 10 && item.category !== "Service").length;
  const totalValue = MOCK_ITEMS.reduce((acc, item) => acc + (item.price * (item.stock || 0)), 0);
  const outOfStock = MOCK_ITEMS.filter(item => item.stock === 0).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Inventory size={22} />
          </div>
          <div>
            <h4 className="text-xl font-black text-dark dark:text-white leading-none">{totalItems}</h4>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dark-5">Total SKU Produk</p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Alert size={22} />
          </div>
          <div>
            <h4 className="text-xl font-black text-dark dark:text-white leading-none">{lowStockItems}</h4>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dark-5">Stok Menipis (&lt;10)</p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Chart size={22} />
          </div>
          <div>
            <h4 className="text-xl font-black text-dark dark:text-white leading-none">Rp {formatNumber(totalValue)}</h4>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dark-5">Total Nilai Aset</p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Antrean size={22} />
          </div>
          <div>
            <h4 className="text-xl font-black text-dark dark:text-white leading-none">{outOfStock}</h4>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dark-5">Habis Stok</p>
          </div>
        </div>
      </div>
    </div>
  );
}
