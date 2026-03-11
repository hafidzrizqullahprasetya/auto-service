"use client";

import { useEffect, useState } from "react";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

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
  const [topServices, setTopServices] = useState<any[]>([]);
  const [topSpareparts, setTopSpareparts] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchTop() {
      try {
        setLoadingServices(true);
        const { data: svc } = await api.get<any>("/reports/top-services?limit=6");
        setTopServices(svc || []);
      } catch (err) {
        console.error("Failed to load top services", err);
      } finally {
        setLoadingServices(false);
      }

      try {
        setLoadingProducts(true);
        const { data: prd } = await api.get<any>("/reports/top-products?limit=6");
        setTopSpareparts(prd || []);
      } catch (err) {
        console.error("Failed to load top products", err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchTop();
  }, []);

  const maxServiceCount = topServices[0]?.count ?? 1;
  const maxPartQty = topSpareparts[0]?.total_qty ?? 1;

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
          {loadingServices ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-2 dark:bg-dark-3" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-2 dark:bg-dark-3" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-gray-2 dark:bg-dark-3" />
                </div>
              </div>
            ))
          ) : topServices.length > 0 ? (
            topServices.map((svc, i) => (
              <RankBar
                key={`${svc.name}-${i}`}
                rank={i + 1}
                name={svc.name}
                primaryStat={`${svc.count}x`}
                secondaryStat={`Rp ${formatNumber(Number(svc.revenue || 0))}`}
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
          {loadingProducts ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-2 dark:bg-dark-3" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-gray-2 dark:bg-dark-3" />
                  <div className="h-2 w-full animate-pulse rounded-full bg-gray-2 dark:bg-dark-3" />
                </div>
              </div>
            ))
          ) : topSpareparts.length > 0 ? (
            topSpareparts.map((part, i) => (
              <RankBar
                key={`${part.name}-${i}`}
                rank={i + 1}
                name={part.name}
                primaryStat={`${part.total_qty} UNIT`}
                secondaryStat={`Rp ${formatNumber(Number(part.revenue || 0))}`}
                pct={Math.round((part.total_qty / (maxPartQty || 1)) * 100)}
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
