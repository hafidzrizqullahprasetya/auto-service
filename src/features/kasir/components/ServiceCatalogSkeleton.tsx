import { Skeleton } from "@/components/ui/skeleton";

export function ServiceCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2"
        >
          <div className="mb-3 flex items-start justify-between">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-9 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-5 w-4/5" />
          <Skeleton className="mb-3 h-4 w-24 rounded" />
          
          <div className="mb-3 space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
