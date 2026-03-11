import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function RevenueAnalysisSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="my-4 h-[310px] w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-center border-t border-stroke dark:border-dark-3 pt-6">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-40" />
        </div>
      </div>
    </div>
  );
}
