import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function VehicleTypeRatioSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-40 mb-1" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>

      <div className="w-full grid place-items-center">
        <Skeleton className="h-[240px] w-[240px] rounded-full" />
      </div>
    </div>
  );
}
