"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { PaymentsOverviewChart } from "@/components/ui/charts/payments-overview/chart";
import { api } from "@/lib/api";

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
        const dateParam = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
        const res = await api.get<any>(`/reports/revenue?period=monthly&date=${dateParam}`);
        
        if (res.data && res.data.daily_breakdown) {
          const breakdown: { date: string; revenue: number }[] = res.data.daily_breakdown;
          const received = breakdown.map(b => ({
            x: b.date.split("-")[2], // Just the day
            y: b.revenue / 1000000 // In millions for the chart if it expects that, but let's actually just pass revenue
          }));
          
          setData({
            received: received.length ? received : [{ x: "No Data", y: 0 }],
            due: received.map(r => ({ x: r.x, y: 0 })) // Mock due as 0 since we don't have separate pending revenue in this endpoint currently
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
            Rp {standardFormat(data.received.reduce((acc, { y }) => acc + y, 0) * 1000000)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Pemasukan</dd>
        </div>

        <div>
           <dt className="text-2xl font-bold tracking-tight text-dark dark:text-white">
            Rp {standardFormat(data.due.reduce((acc, { y }) => acc + y, 0) * 1000000)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Pendapatan Tertunda</dd>
        </div>
      </dl>
    </div>
  );
}
