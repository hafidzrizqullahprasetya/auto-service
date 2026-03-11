"use client";

import { Icons } from "@/components/Icons";
import { formatNumber } from "@/utils/format-number";
import { useInventory } from "@/hooks/useInventory";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function InventorySummary() {
  const { data, loading } = useInventory();
  
  const totalItems = data.filter((item) => item.category !== "Service").length;
  const lowStockItems = data.filter(
    (item) =>
      item.stock !== undefined &&
      item.minimumStock !== undefined &&
      item.stock <= item.minimumStock &&
      item.category !== "Service" &&
      item.stock > 0
  ).length;
  
  const outOfStock = data.filter((item) => item.stock === 0 && item.category !== "Service").length;
  
  const totalValue = data.reduce(
    (acc, item) => acc + (item.costPrice || item.price) * (item.stock || 0),
    0,
  );

  const stats = [
    {
      label: "Total SKU Produk",
      value: totalItems,
      icon: <Icons.Inventory size={20} />,
      color: "text-primary",
      bg: "bg-primary/10",
      isMoney: false,
    },
    {
      label: "Stok Menipis",
      value: lowStockItems,
      icon: <Icons.Alert size={20} />,
      color: "text-warning",
      bg: "bg-warning/10",
      isMoney: false,
    },
    {
      label: "Stok Habis",
      value: outOfStock,
      icon: <Icons.Alert size={20} />,
      color: "text-red-500",
      bg: "bg-red-500/10",
      isMoney: false,
    },
    {
      label: "Total Nilai Stok",
      value: totalValue,
      icon: <Icons.Chart size={20} />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      isMoney: true,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {stats.map(({ label, value, icon, color, bg, isMoney }) => (
        <div
          key={label}
          className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bg} ${color}`}>
              {icon}
            </div>
            <div>
              <h4 className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
                {loading ? (
                  <Skeleton width={80} />
                ) : (
                  isMoney ? `Rp ${formatNumber(value as number)}` : value
                )}
              </h4>
              <p className="mt-1 text-sm font-medium text-dark-5">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
