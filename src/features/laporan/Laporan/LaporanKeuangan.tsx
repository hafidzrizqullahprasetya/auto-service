"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { Badge } from "@/features/shared";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type Period = "hari-ini" | "minggu-ini" | "bulan-ini" | "semua";

const PERIOD_LABELS: Record<Period, string> = {
  "hari-ini": "Hari Ini",
  "minggu-ini": "Minggu Ini",
  "bulan-ini": "Bulan Ini",
  semua: "Semua",
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: { v: number; up: boolean };
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: Omit<StatCardProps, "color">) {
  return (
    <div className="rounded-lg border border-stroke bg-white p-5 shadow-none dark:border-dark-3 dark:bg-gray-dark">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
          <Icon size={22} />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-bold",
              trend.up ? "text-green" : "text-red",
            )}
          >
            {trend.up ? (
              <Icons.ArrowUp size={12} />
            ) : (
              <Icons.ArrowDown size={12} />
            )}
            {trend.v}%
          </div>
        )}
      </div>
      <h4 className="text-xl font-bold leading-tight tracking-tight text-dark dark:text-white">
        {value}
      </h4>
      <p className="mt-1 text-xs font-medium text-dark-5">{label}</p>
      {sub && (
        <p className="mt-1 text-[11px] font-medium text-secondary">{sub}</p>
      )}
    </div>
  );
}

export function LaporanKeuangan() {
  const { data: allTransactions } = useTransactions();
  const [period, setPeriod] = useState<Period>("semua");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    const now = dayjs();
    return allTransactions.filter((tx) => {
      const d = dayjs(tx.date);
      if (dateFrom && dateTo) {
        return (
          d.isAfter(dayjs(dateFrom).subtract(1, "day")) &&
          d.isBefore(dayjs(dateTo).add(1, "day"))
        );
      }
      switch (period) {
        case "hari-ini":
          return d.isSame(now, "day");
        case "minggu-ini":
          return d.isSame(now, "week");
        case "bulan-ini":
          return d.isSame(now, "month");
        default:
          return true;
      }
    });
  }, [allTransactions, period, dateFrom, dateTo]);

  const totalPendapatan = filtered.reduce((a, t) => a + t.total, 0);
  const pendapatanJasa = filtered
    .filter((t) => t.type === "Service")
    .reduce((a, t) => a + t.total, 0);
  const pendapatanPart = filtered
    .filter((t) => t.type === "Sparepart Only")
    .reduce((a, t) => a + t.total, 0);
  const totalPajak = filtered.reduce((a, t) => a + t.tax, 0);

  const cashTx = filtered.filter((t) => t.paymentMethod === "Cash").length;
  const transferTx = filtered.filter(
    (t) => t.paymentMethod === "Transfer",
  ).length;
  const ewalletTx = filtered.filter(
    (t) => t.paymentMethod === "E-Wallet",
  ).length;
  const cardTx = filtered.filter((t) => t.paymentMethod === "Card").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Period Filter Bar */}
      <div className="flex flex-col gap-4 rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-stroke bg-gray-1 p-1 dark:border-dark-3 dark:bg-dark-2">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setDateFrom("");
                setDateTo("");
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-bold",
                period === p && !dateFrom
                  ? "bg-dark text-white dark:bg-white dark:text-dark"
                  : "text-dark-5 hover:text-dark dark:hover:text-white",
              )}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPeriod("semua");
            }}
            className="rounded-lg border border-stroke bg-gray-1 px-3 py-2 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <span className="text-sm font-bold text-dark-5">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPeriod("semua");
            }}
            className="rounded-lg border border-stroke bg-gray-1 px-3 py-2 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Pendapatan"
          value={`Rp ${formatNumber(totalPendapatan)}`}
          icon={Icons.Kasir}
          trend={{ v: 12.5, up: true }}
        />
        <StatCard
          label="Pendapatan Jasa"
          value={`Rp ${formatNumber(pendapatanJasa)}`}
          sub={`${filtered.filter((t) => t.type === "Service").length} transaksi`}
          icon={Icons.Repair}
        />
        <StatCard
          label="Pendapatan Sparepart"
          value={`Rp ${formatNumber(pendapatanPart)}`}
          sub={`${filtered.filter((t) => t.type === "Sparepart Only").length} transaksi`}
          icon={Icons.Inventory}
        />
        <StatCard
          label="Total PPN Terkumpul"
          value={`Rp ${formatNumber(totalPajak)}`}
          sub="Tarif 11%"
          icon={Icons.Database}
        />
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Payment Method Breakdown */}
        <div className="rounded-lg border border-stroke bg-white p-5 shadow-none dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-sm font-bold text-dark dark:text-white">
            Metode Pembayaran
          </h3>
          <div className="space-y-3">
            {[
              { label: "Cash", count: cashTx, icon: Icons.Cash },
              { label: "Transfer", count: transferTx, icon: Icons.Database },
              { label: "E-Wallet", count: ewalletTx, icon: Icons.EWallet },
              { label: "Kartu", count: cardTx, icon: Icons.Card },
            ].map(({ label, count, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-bold text-dark dark:text-white">
                    {label}
                  </span>
                </div>
                <span className="text-sm font-bold text-dark dark:text-white">
                  {count}{" "}
                  <span className="text-[11px] font-medium text-dark-5">
                    TX
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Service vs Part Donut-like */}
        <div className="rounded-lg border border-stroke bg-white p-5 shadow-none dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-sm font-bold text-dark dark:text-white">
            Komposisi Pendapatan
          </h3>
          {totalPendapatan > 0 ? (
            <div className="space-y-3">
              {[
                {
                  label: "Jasa Servis",
                  value: pendapatanJasa,
                  total: totalPendapatan,
                  color: "bg-dark dark:bg-white",
                },
                {
                  label: "Sparepart",
                  value: pendapatanPart,
                  total: totalPendapatan,
                  color: "bg-secondary",
                },
              ].map(({ label, value, total, color }) => {
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-bold text-dark dark:text-white">
                        {label}
                      </span>
                      <span className="font-bold text-dark dark:text-white">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                      <div
                        className={cn("h-full rounded-full", color)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium text-dark-5">
                      Rp {formatNumber(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm font-bold text-dark-5">
              TIDAK ADA DATA
            </p>
          )}
        </div>

        {/* Transaction count */}
        <div className="rounded-lg border border-stroke bg-white p-5 shadow-none dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-sm font-bold text-dark dark:text-white">
            Ringkasan Periode
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stroke py-2 dark:border-dark-3">
              <span className="text-xs font-medium text-dark-5">
                Total Transaksi
              </span>
              <span className="text-lg font-bold text-dark dark:text-white">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-stroke py-2 dark:border-dark-3">
              <span className="text-xs font-medium text-dark-5">
                Rata-rata / TX
              </span>
              <span className="font-bold text-dark dark:text-white">
                Rp{" "}
                {filtered.length > 0
                  ? formatNumber(Math.round(totalPendapatan / filtered.length))
                  : "0"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-stroke py-2 dark:border-dark-3">
              <span className="text-xs font-medium text-dark-5">
                Transaksi Jasa
              </span>
              <span className="font-bold text-dark dark:text-white">
                {filtered.filter((t) => t.type === "Service").length}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-dark-5">
                Transaksi Part
              </span>
              <span className="font-bold text-dark dark:text-white">
                {filtered.filter((t) => t.type === "Sparepart Only").length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
