"use client";

import { MOCK_SERVICE_HISTORY } from "@/mock/service-history";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { Transaction } from "@/mock/transactions";

// --- Compute top services from service history ---
function getTopServices() {
  const counter: Record<string, { count: number; revenue: number }> = {};
  MOCK_SERVICE_HISTORY.forEach((rec) => {
    if (!counter[rec.layanan]) counter[rec.layanan] = { count: 0, revenue: 0 };
    counter[rec.layanan].count += 1;
    counter[rec.layanan].revenue += rec.totalBiaya;
  });
  return Object.entries(counter)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

// --- Compute top spareparts from real transactions ---
function getTopSpareparts(transactions: Transaction[]) {
  const counter: Record<string, { qty: number; revenue: number }> = {};
  transactions.forEach((tx) => {
    tx.items.forEach((item) => {
      if (item.name.toLowerCase().startsWith("jasa")) return;
      if (!counter[item.name]) counter[item.name] = { qty: 0, revenue: 0 };
      counter[item.name].qty += item.qty;
      counter[item.name].revenue += item.price * item.qty;
    });
  });
  // Also include service history data
  MOCK_SERVICE_HISTORY.forEach((rec) => {
    rec.items.forEach((item) => {
      if (item.nama.toLowerCase().startsWith("jasa")) return;
      if (!counter[item.nama]) counter[item.nama] = { qty: 0, revenue: 0 };
      counter[item.nama].qty += item.qty;
      counter[item.nama].revenue += item.harga * item.qty;
    });
  });
  return Object.entries(counter)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 6);
}

interface RankBarProps {
  rank: number;
  name: string;
  primaryStat: string;
  secondaryStat: string;
  pct: number;
  color: string;
}

function RankBar({
  rank,
  name,
  primaryStat,
  secondaryStat,
  pct,
  color,
}: RankBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-stroke text-xs font-bold",
          rank === 1
            ? "border-dark bg-dark text-white dark:border-white dark:bg-white dark:text-dark"
            : rank === 2
              ? "bg-gray-3 text-dark dark:bg-dark-3 dark:text-white"
              : rank === 3
                ? "bg-gray-2 text-dark-2 dark:bg-dark-3 dark:text-white/80"
                : "bg-gray-1 text-dark-5 dark:bg-dark-2",
        )}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-bold leading-tight text-dark dark:text-white">
            {name}
          </p>
          <p className="text-xs font-bold text-secondary">{primaryStat}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
            <div
              className={cn("h-full rounded-full", color)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="shrink-0 text-[10px] font-medium tabular-nums text-dark-5">
            {secondaryStat}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LaporanAnalitik() {
  const { data: transactions } = useTransactions();
  const topServices = getTopServices();
  const topSpareparts = getTopSpareparts(transactions);

  const maxServiceCount = topServices[0]?.count ?? 1;
  const maxPartQty = topSpareparts[0]?.qty ?? 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Layanan */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-none dark:border-dark-3 dark:bg-gray-dark">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-dark dark:text-white">
              Layanan Terpopuler
            </h3>
            <p className="mt-1 text-[11px] font-medium text-dark-5">
              Frekuensi permintaan servis
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
            <Icons.Repair size={20} />
          </div>
        </div>
        <div className="space-y-4">
          {topServices.length > 0 ? (
            topServices.map((svc, i) => (
              <RankBar
                key={svc.name}
                rank={i + 1}
                name={svc.name}
                primaryStat={`${svc.count}x`}
                secondaryStat={`Rp ${formatNumber(svc.revenue)}`}
                pct={Math.round((svc.count / maxServiceCount) * 100)}
                color="bg-primary"
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-dark-5">
              Belum ada data
            </p>
          )}
        </div>
      </div>

      {/* Top Sparepart */}
      <div className="rounded-lg border border-stroke bg-white p-6 shadow-none dark:border-dark-3 dark:bg-gray-dark">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-dark dark:text-white">
              Sparepart Terlaris
            </h3>
            <p className="mt-1 text-[11px] font-medium text-dark-5">
              Jumlah unit terjual
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
            <Icons.Inventory size={20} />
          </div>
        </div>
        <div className="space-y-4">
          {topSpareparts.length > 0 ? (
            topSpareparts.map((part, i) => (
              <RankBar
                key={part.name}
                rank={i + 1}
                name={part.name}
                primaryStat={`${part.qty} UNIT`}
                secondaryStat={`Rp ${formatNumber(part.revenue)}`}
                pct={Math.round((part.qty / maxPartQty) * 100)}
                color="bg-dark dark:bg-white"
              />
            ))
          ) : (
            <p className="py-8 text-center text-sm font-medium italic text-dark-5">
              Belum ada data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
