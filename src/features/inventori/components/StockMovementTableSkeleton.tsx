import { Skeleton } from "@/components/ui/skeleton";

export function StockMovementTableSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* StockSummary Skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-stroke bg-white p-5 shadow-sm dark:border-dark-3 dark:bg-gray-dark"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="mb-2 h-7 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-1 h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DataTable Skeleton */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark md:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Skeleton className="mb-2 h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
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
