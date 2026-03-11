import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function WeeklyPerformanceSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 pb-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-48 mb-1" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="mt-4 h-[310px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
