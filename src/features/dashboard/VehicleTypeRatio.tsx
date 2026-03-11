"use client";

import { useEffect, useState } from "react";
import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { DonutChart } from "@/components/ui/charts/used-devices/chart";
import { api } from "@/lib/api";
import Skeleton from "react-loading-skeleton";

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
          setData(res.data.map(d => ({
            name: d.label,
            amount: d.value
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
        {loading ? (
          <Skeleton width={200} height={200} className="rounded-full" />
        ) : data.length > 0 ? (
          <DonutChart data={data} />
        ) : (
          <p className="py-12 text-sm font-medium text-dark-5">Belum ada data</p>
        )}
      </div>
    </div>
  );
}
