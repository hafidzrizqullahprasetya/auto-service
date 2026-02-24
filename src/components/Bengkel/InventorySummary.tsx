"use client";

import { Icons } from "@/components/Icons";
import { formatNumber } from "@/lib/format-number";
import { MOCK_ITEMS } from "@/mock/inventory";

export function InventorySummary() {
  const totalItems = MOCK_ITEMS.filter(item => item.category !== "Service").length;
  const lowStockItems = MOCK_ITEMS.filter(item => item.stock !== undefined && item.stock < 10 && item.category !== "Service").length;
  const totalValue = MOCK_ITEMS.reduce((acc, item) => acc + (item.price * (item.stock || 0)), 0);
  const outOfStock = MOCK_ITEMS.filter(item => item.stock === 0).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icons.Inventory size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-5">Total SKU Produk</p>
            <h4 className="text-xl font-bold text-dark dark:text-white">{totalItems} Item</h4>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow/10 text-yellow">
            <Icons.Alert size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-5">Stok Menipis (&lt;10)</p>
            <h4 className="text-xl font-bold text-dark dark:text-white">{lowStockItems} Item</h4>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-light-1 text-green">
            <Icons.Chart size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-5">Total Nilai Aset</p>
            <h4 className="text-xl font-bold text-dark dark:text-white">Rp {formatNumber(totalValue)}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-light-1 text-red">
            <Icons.Antrean size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-dark-5">Habis Stok</p>
            <h4 className="text-xl font-bold text-dark dark:text-white">{outOfStock} Item</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
