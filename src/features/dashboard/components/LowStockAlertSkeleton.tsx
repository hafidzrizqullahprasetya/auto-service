import { Skeleton } from "@/components/ui/skeleton";

export function LowStockAlertSkeleton() {
  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-6 w-40 mb-1" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-lg border border-stroke bg-gray-1 px-4 py-3 dark:border-dark-3 dark:bg-dark-2"
          >
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="text-right">
              <Skeleton className="h-5 w-24 mb-1.5" />
              <Skeleton className="h-1 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
