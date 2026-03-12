"use client";

import { StatCard } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/types/inventory";

interface InventorySummaryProps {
  data: Item[];
  loading?: boolean;
}

export function InventorySummary({ data, loading = false }: InventorySummaryProps) {
  
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
      isMoney: false,
    },
    {
      label: "Stok Menipis",
      value: lowStockItems,
      icon: <Icons.Alert size={20} />,
      isMoney: false,
    },
    {
      label: "Stok Habis",
      value: outOfStock,
      icon: <Icons.Alert size={20} />,
      isMoney: false,
    },
    {
      label: "Total Nilai Stok",
      value: totalValue,
      icon: <Icons.Chart size={20} />,
      isMoney: true,
    },
  ];

  return (
    <div className="hidden sm:grid mb-6 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {stats.map(({ label, value, icon, isMoney }) => (
        <StatCard
          key={label}
          label={label}
          value={value}
          icon={icon}
          isMoney={isMoney}
          loading={loading}
          variant="horizontal"
        />
      ))}
    </div>
  );
}
