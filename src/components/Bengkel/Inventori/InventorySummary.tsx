"use client";

import { Icons } from "@/components/Icons";
import { formatNumber } from "@/lib/format-number";
import { useInventory } from "@/hooks/useInventory";

export function InventorySummary() {
  const { data } = useInventory();
  const totalItems = data.filter((item) => item.category !== "Service").length;
  const lowStockItems = data.filter(
    (item) =>
      item.stock !== undefined &&
      item.minimumStock !== undefined &&
      item.stock <= item.minimumStock &&
      item.category !== "Service",
  ).length;
  const totalValue = data.reduce(
    (acc, item) => acc + item.price * (item.stock || 0),
    0,
  );
  const outOfStock = data.filter((item) => item.stock === 0).length;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Inventory size={22} />
          </div>
          <div>
            <h4 className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
              {totalItems}
            </h4>
            <p className="mt-1 text-sm font-medium text-dark-5">
              Total SKU Produk
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Alert size={22} />
          </div>
          <div>
            <h4 className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
              {lowStockItems}
            </h4>
            <p className="mt-1 text-sm font-medium text-dark-5">
              Stok Menipis (&lt;10)
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Chart size={22} />
          </div>
          <div>
            <h4 className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
              Rp {formatNumber(totalValue)}
            </h4>
            <p className="mt-1 text-sm font-medium text-dark-5">
              Total Nilai Aset
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
            <Icons.Antrean size={22} />
          </div>
          <div>
            <h4 className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
              {outOfStock}
            </h4>
            <p className="mt-1 text-sm font-medium text-dark-5">Habis Stok</p>
          </div>
        </div>
      </div>
    </div>
  );
}
