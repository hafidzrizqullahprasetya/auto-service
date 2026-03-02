import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getVehicleRatioData } from "@/mock/dashboard-charts";
import { DonutChart } from "@/components/Charts/used-devices/chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function VehicleTypeRatio({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const rawData = getVehicleRatioData();
  
  // Transform to format expected by DonutChart: { name: string; amount: number }[]
  const data = rawData.map(d => ({
    name: d.label,
    amount: d.value
  }));

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

      <div className="grid place-items-center">
        <DonutChart data={data} />
      </div>
    </div>
  );
}
