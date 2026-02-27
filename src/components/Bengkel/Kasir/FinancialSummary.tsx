"use client";

import { Icons } from "@/components/icons";
import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color: "primary" | "secondary" | "success" | "warning" | "danger";
}

function SummaryCard({ title, value, icon, trend, color }: SummaryCardProps) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    success: "bg-green-light-1 text-green",
    warning: "bg-yellow-light-1 text-yellow",
    danger: "bg-red-light-1 text-red",
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center justify-between">
        <div className={cn("flex h-12.5 w-12.5 items-center justify-center rounded-full", colorStyles[color])}>
          {icon}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-sm font-medium", trend.isUp ? "text-green" : "text-red")}>
            {trend.isUp ? <Icons.ArrowUp size={16} /> : <Icons.ArrowDown size={16} />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {typeof value === "number" ? `Rp ${formatNumber(value)}` : value}
          </h4>
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">{title}</span>
        </div>
      </div>
    </div>
  );
}

export function FinancialSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      <SummaryCard 
        title="Total Pendapatan" 
        value={45280000} 
        icon={<Icons.Kasir size={24} />} 
        color="secondary"
        trend={{ value: 12.5, isUp: true }}
      />
      <SummaryCard 
        title="Laba Bersih" 
        value={15420000} 
        icon={<Icons.Chart size={24} />} 
        color="success"
        trend={{ value: 8.2, isUp: true }}
      />
      <SummaryCard 
        title="Total Pengeluaran" 
        value={29860000} 
        icon={<Icons.Inventory size={24} />} 
        color="danger"
        trend={{ value: 2.1, isUp: false }}
      />
      <SummaryCard 
        title="Jumlah Transaksi" 
        value="124 Transaksi" 
        icon={<Icons.Antrean size={24} />} 
        color="primary"
        trend={{ value: 15.0, isUp: true }}
      />
    </div>
  );
}
