"use client";

import { useEffect, useState } from "react";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";
import { StatCard } from "@/features/dashboard/StatCard";
import { Icons } from "@/components/Icons";

export function OverviewCardsGroup() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await dashboardService.getOverview();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
     return (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
           {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="h-32 animate-pulse rounded-[10px] bg-white dark:bg-gray-dark shadow-1" />
           ))}
        </div>
     );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <StatCard
        title="Antrean Aktif"
        value={data.activeQueue.value}
        icon={<Icons.Antrean size={24} />}
        growth={{
          value: data.activeQueue.growth,
          isUp: data.activeQueue.isUp
        }}
      />

      <StatCard
        title="Kendaraan Selesai"
        value={data.completedTasks.value}
        icon={<Icons.Success size={24} />}
        growth={{
          value: data.completedTasks.growth,
          isUp: data.completedTasks.isUp
        }}
      />

      <StatCard
        title="Pendapatan Hari Ini"
        value={data.dailyRevenue.value}
        icon={<Icons.Cash size={24} />}
        growth={{
          value: data.dailyRevenue.growth,
          isUp: data.dailyRevenue.isUp
        }}
      />

      <StatCard
        title="Menunggu Sparepart"
        value={data.pendingSpareparts.value}
        icon={<Icons.Inventory size={24} />}
        growth={{
          value: data.pendingSpareparts.growth,
          isUp: data.pendingSpareparts.isUp
        }}
      />
    </div>
  );
}
