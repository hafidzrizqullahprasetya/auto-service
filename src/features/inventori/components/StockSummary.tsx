"use client";

import { Icons } from "@/components/Icons";
import { StockMovement } from "@/types/stock-movement";

interface StockSummaryProps {
  movements: StockMovement[];
}

export function StockSummary({ movements }: StockSummaryProps) {
  const totalMasuk = movements
    .filter((m) => m.type === "masuk")
    .reduce((s, m) => s + m.quantityChange, 0);
  const totalKeluar = movements
    .filter((m) => m.type === "keluar")
    .reduce((s, m) => s + Math.abs(m.quantityChange), 0);

  const stats = [
    {
      label: "Total Masuk",
      value: totalMasuk,
      sub: "unit masuk",
      icon: <Icons.ArrowUp size={20} />,
      color: "text-green-600",
      bg: "bg-green-100/50 dark:bg-green-500/10",
    },
    {
      label: "Total Keluar",
      value: totalKeluar,
      sub: "unit keluar",
      icon: <Icons.ArrowDown size={20} />,
      color: "text-red-500",
      bg: "bg-red-100/50 dark:bg-red-500/10",
    },
    {
      label: "Total Transaksi",
      value: movements.length,
      sub: "entri log",
      icon: <Icons.History size={20} />,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {stats.map(({ label, value, sub, icon, color, bg }) => (
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
                {value}
              </h4>
              <p className="mt-1 text-sm font-medium text-dark-5">{label}</p>
              <p className="text-[10px] font-medium text-dark-6 uppercase">{sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
