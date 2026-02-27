"use client";

import { MOCK_TRANSACTIONS } from "@/mock/transactions";
import { MOCK_SERVICE_HISTORY } from "@/mock/service-history";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

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

// --- Compute top spareparts from all item lists ---
function getTopSpareparts() {
  const counter: Record<string, { qty: number; revenue: number }> = {};
  // From transactions
  MOCK_TRANSACTIONS.forEach((tx) => {
    tx.items.forEach((item) => {
      // Skip pure service items (no "Jasa" prefix)
      if (item.name.toLowerCase().startsWith("jasa")) return;
      if (!counter[item.name]) counter[item.name] = { qty: 0, revenue: 0 };
      counter[item.name].qty += item.qty;
      counter[item.name].revenue += item.price * item.qty;
    });
  });
  // From service history
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

function RankBar({ rank, name, primaryStat, secondaryStat, pct, color }: RankBarProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black",
          rank === 1
            ? "bg-yellow text-dark"
            : rank === 2
            ? "bg-gray-3 dark:bg-dark-3 text-dark dark:text-white"
            : rank === 3
            ? "bg-orange-200 text-orange-800"
            : "bg-gray-1 dark:bg-dark-2 text-dark-5"
        )}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-dark dark:text-white truncate">{name}</p>
          <p className="text-xs font-bold text-dark-5 shrink-0">{primaryStat}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
            <div
              className={cn("h-full rounded-full", color)}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-dark-5 shrink-0">{secondaryStat}</p>
        </div>
      </div>
    </div>
  );
}

export function LaporanAnalitik() {
  const topServices = getTopServices();
  const topSpareparts = getTopSpareparts();

  const maxServiceCount = topServices[0]?.count ?? 1;
  const maxPartQty = topSpareparts[0]?.qty ?? 1;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top Layanan */}
      <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-dark dark:text-white">Layanan Terpopuler</h3>
            <p className="mt-0.5 text-xs text-dark-5">Berdasarkan frekuensi permintaan</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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
            <p className="text-center text-sm text-dark-5 py-8">Belum ada data</p>
          )}
        </div>
      </div>

      {/* Top Sparepart */}
      <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-dark dark:text-white">Sparepart Terlaris</h3>
            <p className="mt-0.5 text-xs text-dark-5">Berdasarkan jumlah unit terjual</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
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
                primaryStat={`${part.qty} unit`}
                secondaryStat={`Rp ${formatNumber(part.revenue)}`}
                pct={Math.round((part.qty / maxPartQty) * 100)}
                color="bg-secondary"
              />
            ))
          ) : (
            <p className="text-center text-sm text-dark-5 py-8">Belum ada data</p>
          )}
        </div>
      </div>
    </div>
  );
}
