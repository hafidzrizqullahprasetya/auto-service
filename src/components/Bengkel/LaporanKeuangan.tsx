"use client";

import { useState, useMemo } from "react";
import { MOCK_TRANSACTIONS } from "@/mock/transactions";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { Badge } from "./Badge";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type Period = "hari-ini" | "minggu-ini" | "bulan-ini" | "semua";

const PERIOD_LABELS: Record<Period, string> = {
  "hari-ini": "Hari Ini",
  "minggu-ini": "Minggu Ini",
  "bulan-ini": "Bulan Ini",
  "semua": "Semua",
};

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  trend?: { v: number; up: boolean };
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex items-center justify-between mb-3">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-full", color)}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-xs font-bold", trend.up ? "text-green" : "text-red")}>
            {trend.up ? <Icons.ArrowUp size={13} /> : <Icons.ArrowDown size={13} />}
            {trend.v}%
          </div>
        )}
      </div>
      <h4 className="text-xl font-black text-dark dark:text-white leading-tight">{value}</h4>
      <p className="mt-0.5 text-sm font-medium text-dark-5">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-dark-5">{sub}</p>}
    </div>
  );
}

export function LaporanKeuangan() {
  const [period, setPeriod] = useState<Period>("semua");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = useMemo(() => {
    const now = dayjs();
    return MOCK_TRANSACTIONS.filter(tx => {
      const d = dayjs(tx.date);
      if (dateFrom && dateTo) {
        return d.isAfter(dayjs(dateFrom).subtract(1, "day")) && d.isBefore(dayjs(dateTo).add(1, "day"));
      }
      switch (period) {
        case "hari-ini": return d.isSame(now, "day");
        case "minggu-ini": return d.isSame(now, "week");
        case "bulan-ini": return d.isSame(now, "month");
        default: return true;
      }
    });
  }, [period, dateFrom, dateTo]);

  const totalPendapatan = filtered.reduce((a, t) => a + t.total, 0);
  const pendapatanJasa = filtered.filter(t => t.type === "Service").reduce((a, t) => a + t.total, 0);
  const pendapatanPart = filtered.filter(t => t.type === "Sparepart Only").reduce((a, t) => a + t.total, 0);
  const totalPajak = filtered.reduce((a, t) => a + t.tax, 0);

  const cashTx = filtered.filter(t => t.paymentMethod === "Cash").length;
  const transferTx = filtered.filter(t => t.paymentMethod === "Transfer").length;
  const ewalletTx = filtered.filter(t => t.paymentMethod === "E-Wallet").length;
  const cardTx = filtered.filter(t => t.paymentMethod === "Card").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Period Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center gap-1 rounded-xl border border-stroke bg-gray-1 dark:border-dark-3 dark:bg-dark-2 p-1">
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => { setPeriod(p); setDateFrom(""); setDateTo(""); }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-semibold transition-all",
                period === p && !dateFrom
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark-5 hover:text-dark dark:hover:text-white"
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
            onChange={e => { setDateFrom(e.target.value); setPeriod("semua"); }}
            className="rounded-lg border border-stroke bg-gray-1 px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
          <span className="text-dark-5 text-sm">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => { setDateTo(e.target.value); setPeriod("semua"); }}
            className="rounded-lg border border-stroke bg-gray-1 px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Pendapatan" value={`Rp ${formatNumber(totalPendapatan)}`} icon={Icons.Kasir} color="bg-secondary/10 text-secondary" trend={{ v: 12.5, up: true }} />
        <StatCard label="Pendapatan Jasa" value={`Rp ${formatNumber(pendapatanJasa)}`} sub={`${filtered.filter(t => t.type === "Service").length} transaksi`} icon={Icons.Repair} color="bg-primary/10 text-primary" />
        <StatCard label="Pendapatan Sparepart" value={`Rp ${formatNumber(pendapatanPart)}`} sub={`${filtered.filter(t => t.type === "Sparepart Only").length} transaksi`} icon={Icons.Inventory} color="bg-green-light-1 text-green" />
        <StatCard label="Total PPN Terkumpul" value={`Rp ${formatNumber(totalPajak)}`} sub="Tarif 11%" icon={Icons.Database} color="bg-yellow/10 text-yellow" />
      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Payment Method Breakdown */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 font-bold text-dark dark:text-white">Metode Pembayaran</h3>
          <div className="space-y-3">
            {[
              { label: "Cash", count: cashTx, icon: Icons.Cash, color: "text-green", bg: "bg-green-light-1" },
              { label: "Transfer", count: transferTx, icon: Icons.Database, color: "text-primary", bg: "bg-primary/10" },
              { label: "E-Wallet", count: ewalletTx, icon: Icons.EWallet, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20" },
              { label: "Kartu", count: cardTx, icon: Icons.Card, color: "text-secondary", bg: "bg-secondary/10" },
            ].map(({ label, count, icon: Icon, color, bg }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bg)}>
                    <Icon size={15} className={color} />
                  </div>
                  <span className="text-sm font-medium text-dark dark:text-white">{label}</span>
                </div>
                <span className="text-sm font-bold text-dark dark:text-white">{count} tx</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service vs Part Donut-like */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 font-bold text-dark dark:text-white">Komposisi Pendapatan</h3>
          {totalPendapatan > 0 ? (
            <div className="space-y-3">
              {[
                { label: "Jasa Servis", value: pendapatanJasa, total: totalPendapatan, color: "bg-primary" },
                { label: "Sparepart", value: pendapatanPart, total: totalPendapatan, color: "bg-secondary" },
              ].map(({ label, value, total, color }) => {
                const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-dark dark:text-white">{label}</span>
                      <span className="font-bold text-dark dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                      <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-dark-5">Rp {formatNumber(value)}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-dark-5 text-center py-8">Tidak ada data</p>
          )}
        </div>

        {/* Transaction count */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 font-bold text-dark dark:text-white">Ringkasan Periode</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-stroke dark:border-dark-3">
              <span className="text-sm text-dark-5">Total Transaksi</span>
              <span className="font-black text-lg text-dark dark:text-white">{filtered.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stroke dark:border-dark-3">
              <span className="text-sm text-dark-5">Rata-rata / Transaksi</span>
              <span className="font-bold text-dark dark:text-white">
                Rp {filtered.length > 0 ? formatNumber(Math.round(totalPendapatan / filtered.length)) : "0"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-stroke dark:border-dark-3">
              <span className="text-sm text-dark-5">Transaksi Jasa</span>
              <span className="font-bold text-dark dark:text-white">{filtered.filter(t => t.type === "Service").length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-dark-5">Transaksi Sparepart</span>
              <span className="font-bold text-dark dark:text-white">{filtered.filter(t => t.type === "Sparepart Only").length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
