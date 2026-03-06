"use client";

import { Icons } from "@/components/Icons";
import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";

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

function SummaryCard({
  title,
  value,
  icon,
  trend,
}: Omit<SummaryCardProps, "color">) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center justify-between">
        <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-2 dark:text-blue-400">
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-bold",
              trend.isUp ? "text-green" : "text-red",
            )}
          >
            {trend.isUp ? (
              <Icons.ArrowUp size={12} />
            ) : (
              <Icons.ArrowDown size={12} />
            )}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="mb-0.5 text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
            {typeof value === "number" ? `Rp ${formatNumber(value)}` : value}
          </h4>
          <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FinancialSummary() {
  const { data: transactions } = useTransactions();

  const totalPendapatan = transactions.reduce((a, t) => a + t.total, 0);
  const totalPengeluaran = transactions.reduce(
    (a, t) => a + t.subtotal - (t.total - t.tax),
    0,
  );
  const totalPajak = transactions.reduce((a, t) => a + t.tax, 0);
  const jumlahTx = transactions.length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      <SummaryCard
        title="Total Pendapatan"
        value={totalPendapatan}
        icon={<Icons.Kasir size={24} />}
      />
      <SummaryCard
        title="Total PPN"
        value={totalPajak}
        icon={<Icons.Chart size={24} />}
      />
      <SummaryCard
        title="Subtotal (Pra-pajak)"
        value={totalPengeluaran}
        icon={<Icons.Inventory size={24} />}
      />
      <SummaryCard
        title="Jumlah Transaksi"
        value={`${jumlahTx} Transaksi`}
        icon={<Icons.Antrean size={24} />}
      />
    </div>
  );
}
