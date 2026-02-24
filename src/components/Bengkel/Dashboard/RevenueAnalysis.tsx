import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getRevenueData } from "@/mock/dashboard-charts";
import { PaymentsOverviewChart } from "@/components/Charts/payments-overview/chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function RevenueAnalysis({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const data = getRevenueData(timeFrame);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
            Analisis Pendapatan
          </h2>
          <p className="text-xs font-medium text-dark-5">Total pemasukan dari Jasa & Sparepart</p>
        </div>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      <PaymentsOverviewChart data={data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            Rp {standardFormat(data.received.reduce((acc, { y }) => acc + y, 0) * 1000000)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Total Pemasukan</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            Rp {standardFormat(data.due.reduce((acc, { y }) => acc + y, 0) * 1000000)}
          </dt>
          <dd className="font-medium dark:text-dark-6">Pendapatan Tertunda</dd>
        </div>
      </dl>
    </div>
  );
}
