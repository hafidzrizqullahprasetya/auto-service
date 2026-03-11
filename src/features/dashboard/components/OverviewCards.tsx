"use client";

import { useEffect, useState } from "react";
import { dashboardService, DashboardStats } from "@/services/dashboard.service";
import { OverviewCardsSkeleton } from "./OverviewCardsSkeleton";
import { StatCard } from "@/features/shared";
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
     return <OverviewCardsSkeleton />;
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <StatCard
        label="Antrean Aktif"
        value={data.activeQueue.value}
        icon={<Icons.Antrean size={24} />}
        growth={{
          value: data.activeQueue.growth,
          isUp: data.activeQueue.isUp
        }}
        variant="vertical"
      />

      <StatCard
        label="Kendaraan Selesai"
        value={data.completedTasks.value}
        icon={<Icons.Success size={24} />}
        growth={{
          value: data.completedTasks.growth,
          isUp: data.completedTasks.isUp
        }}
        variant="vertical"
      />

      <StatCard
        label="Pendapatan Hari Ini"
        value={data.dailyRevenue.value}
        isMoney
        icon={<Icons.Cash size={24} />}
        growth={{
          value: data.dailyRevenue.growth,
          isUp: data.dailyRevenue.isUp
        }}
        variant="vertical"
      />

      <StatCard
        label="Menunggu Sparepart"
        value={data.pendingSpareparts.value}
        icon={<Icons.Inventory size={24} />}
        growth={{
          value: data.pendingSpareparts.growth,
          isUp: data.pendingSpareparts.isUp
        }}
        variant="vertical"
      />
    </div>
  );
}
