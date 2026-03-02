import { Suspense } from "react";
import type { Metadata } from "next";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { LowStockAlert } from "@/components/Bengkel/Dashboard/LowStockAlert";
import { TopServices } from "@/components/Bengkel/Dashboard/TopServices";
import { RecentActivity } from "@/components/Bengkel/Dashboard/RecentActivity";
import { RevenueAnalysis } from "@/components/Bengkel/Dashboard/RevenueAnalysis";
import { VehicleTypeRatio } from "@/components/Bengkel/Dashboard/VehicleTypeRatio";
import { createTimeFrameExtractor } from "@/lib/timeframe-extractor";

export const metadata: Metadata = {
  title: "Dashboard — AutoService",
  description: "Snapshot aktivitas dan kondisi terkini bengkel",
};

type PropsType = {
  searchParams: Promise<{ selected_time_frame?: string }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Row 1: 4 Stat Cards ─────────────────────────────────────── */}
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      {/* ── Row 2: Alert Stok Menipis (full width — prioritas utama) ── */}
      <LowStockAlert />

      {/* ── Row 3: Grafik Pendapatan + Rasio Kendaraan ──────────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Grafik area pendapatan — 8 kolom */}
        <RevenueAnalysis
          className="col-span-12 xl:col-span-8"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        {/* Donut rasio mobil vs motor — 4 kolom */}
        <VehicleTypeRatio
          className="col-span-12 xl:col-span-4"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />
      </div>

      {/* ── Row 4: Top Barang Terlaris + Aktivitas Bengkel ──────────── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top 5 Jasa & Sparepart — 7 kolom */}
        <div className="col-span-12 xl:col-span-7">
          <Suspense fallback={null}>
            <TopServices />
          </Suspense>
        </div>

        {/* Aktivitas terkini — 5 kolom */}
        <RecentActivity className="col-span-12 xl:col-span-5" />
      </div>

    </div>
  );
}
