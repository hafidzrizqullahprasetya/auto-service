import { RevenueAnalysis } from "@/components/Bengkel/Dashboard/RevenueAnalysis";
import { VehicleTypeRatio } from "@/components/Bengkel/Dashboard/VehicleTypeRatio";
import { WeeklyPerformance } from "@/components/Bengkel/Dashboard/WeeklyPerformance";
import { TopServices } from "@/components/Bengkel/Dashboard/TopServices";
import { RecentActivity } from "@/components/Bengkel/Dashboard/RecentActivity";
import { createTimeFrameExtractor } from "@/lib/timeframe-extractor";
import { Suspense } from "react";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <RevenueAnalysis
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeklyPerformance
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-5"
        />

        <VehicleTypeRatio
          className="col-span-12 xl:col-span-5"
          key={extractTimeFrame("used_devices")}
          timeFrame={extractTimeFrame("used_devices")?.split(":")[1]}
        />

        <div className="col-span-12 grid xl:col-span-7">
          <Suspense fallback={null}>
            <TopServices />
          </Suspense>
        </div>

        <RecentActivity className="col-span-12 xl:col-span-5" />
      </div>
    </>
  );
}
