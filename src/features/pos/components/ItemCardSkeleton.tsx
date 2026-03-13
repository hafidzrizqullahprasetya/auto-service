import { Skeleton } from "@/components/ui/skeleton";

export function ItemCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-stroke bg-white overflow-hidden dark:border-dark-3 dark:bg-dark-2">
      <Skeleton className="h-32 w-full" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Skeleton className="mb-2 h-3 w-12" />
          <Skeleton className="mb-1 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ItemCardSkeleton key={i} />
      ))}
    </div>
  );
}
