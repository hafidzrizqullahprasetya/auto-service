import { Skeleton } from "@/components/ui/skeleton";

export function OrderSummarySkeleton() {
  return (
    <div className="rounded-[10px] border border-stroke bg-gray-2 p-4 dark:border-dark-3 dark:bg-dark-3">
      <div className="mb-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-4 flex justify-between border-t border-stroke pt-4 dark:border-dark-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      <Skeleton className="h-14 w-full rounded-xl" />
      
      <div className="mt-3 flex justify-center">
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}
