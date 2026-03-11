"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { DonutChart } from "@/components/ui/charts/used-devices/chart";
import { Icons } from "@/components/Icons";
import { api } from "@/lib/api";
import { VehicleTypeRatioSkeleton } from "./VehicleTypeRatioSkeleton";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function VehicleTypeRatio({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const [data, setData] = useState<{ name: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRatio() {
      try {
        const res = await api.get<any[]>("/reports/vehicle-ratio");
        if (res.data) {
          const grouped = res.data.reduce((acc: any, curr: any) => {
            const label = curr.label.charAt(0).toUpperCase() + curr.label.slice(1).toLowerCase();
            acc[label] = (acc[label] || 0) + curr.value;
            return acc;
          }, {});

          setData(Object.keys(grouped).map(key => ({
            name: key,
            amount: grouped[key]
          })));
        }
      } catch (err) {
        console.error("Failed to fetch vehicle ratio", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRatio();
  }, [timeFrame]);

  if (loading) return <VehicleTypeRatioSkeleton className={className} />;

  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-dark dark:text-white">
            Rasio Kendaraan
          </h2>
          <p className="text-xs font-medium text-dark-5">Perbandingan Mobil vs Motor</p>
        </div>

        <PeriodPicker defaultValue={timeFrame} sectionKey="used_devices" />
      </div>

      <div className="w-full grid place-items-center">
        {data.length > 0 ? (
          <DonutChart data={data} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icons.Success className="mb-2 size-8 text-green/20" />
            <p className="text-sm font-medium text-dark-5">Belum ada data kendaraan</p>
          </div>
        )}
      </div>
    </div>
  );
}
