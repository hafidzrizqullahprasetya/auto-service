"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { formatCurrency } from "@/utils/format-number";
import { cn } from "@/lib/utils";
import { PaymentsOverviewChart } from "@/components/ui/charts/payments-overview/chart";
import { api } from "@/lib/api";

import { RevenueAnalysisSkeleton } from "./RevenueAnalysisSkeleton";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function RevenueAnalysis({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const [data, setData] = useState<{ received: { x: string | number; y: number }[]; due: { x: string | number; y: number }[] }>({ received: [], due: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const today = new Date();
        const dateParam = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`; 
        const res = await api.get<any>(`/reports/revenue?period=monthly&date=${dateParam}`);
        
        if (res.data && res.data.daily_breakdown) {
          const breakdown: { date: string; revenue: number }[] = res.data.daily_breakdown;
          const received = breakdown.map(b => ({
            x: b.date.split("-")[2], 
            y: b.revenue 
          }));
          
          setData({
            received: received.length ? received : [{ x: "No Data", y: 0 }],
            due: received.map(r => ({ x: r.x, y: 0 })) 
          });
        }
      } catch (err) {
        console.error("Failed to load revenue data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRevenue();
  }, [timeFrame]);

  if (loading) return <RevenueAnalysisSkeleton className={className} />;

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Analisis Pendapatan
          </h2>
          <p className="text-xs font-medium text-dark-5">Total pemasukan dari Jasa & Sparepart</p>
        </div>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      <PaymentsOverviewChart data={data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-2xl font-bold tracking-tight text-dark dark:text-white">
            {formatCurrency(data.received.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Pemasukan</dd>
        </div>

        <div>
           <dt className="text-2xl font-bold tracking-tight text-dark dark:text-white">
            {formatCurrency(data.due.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium dark:text-dark-6">Pendapatan Tertunda</dd>
        </div>
      </dl>
    </div>
  );
}
