import { Skeleton } from "@/components/ui/skeleton";

export function StockOpnameTableSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Active Session Warning Skeleton */}
      <div className="rounded-[10px] border border-l-4 border-stroke border-l-secondary bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Skeleton className="size-12 rounded-xl" />
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="mt-1.5 h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-10 w-full sm:w-40" />
        </div>
      </div>

      {/* History Table Skeleton */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Skeleton className="mb-2 h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-44" />
        </div>

        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
