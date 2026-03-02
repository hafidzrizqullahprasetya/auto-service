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

function SummaryCard({ title, value, icon, trend }: Omit<SummaryCardProps, "color">) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-2 dark:text-blue-400">
          {icon}
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-[11px] font-black uppercase tracking-wider", trend.isUp ? "text-green" : "text-red")}>
            {trend.isUp ? <Icons.ArrowUp size={12} /> : <Icons.ArrowDown size={12} />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="mb-0.5 text-xl font-black text-dark dark:text-white leading-none">
            {typeof value === "number" ? `Rp ${formatNumber(value)}` : value}
          </h4>
          <span className="text-[10px] font-bold text-dark-5 dark:text-dark-6 uppercase tracking-widest">{title}</span>
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
        trend={{ value: 12.5, isUp: true }}
      />
      <SummaryCard 
        title="Laba Bersih" 
        value={15420000} 
        icon={<Icons.Chart size={24} />} 
        trend={{ value: 8.2, isUp: true }}
      />
      <SummaryCard 
        title="Total Pengeluaran" 
        value={29860000} 
        icon={<Icons.Inventory size={24} />} 
        trend={{ value: 2.1, isUp: false }}
      />
      <SummaryCard 
        title="Jumlah Transaksi" 
        value="124 Transaksi" 
        icon={<Icons.Antrean size={24} />} 
        trend={{ value: 15.0, isUp: true }}
      />
    </div>
  );
}
