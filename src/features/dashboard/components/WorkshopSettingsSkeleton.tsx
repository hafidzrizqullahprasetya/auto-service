import { Skeleton } from "@/components/ui/skeleton";

export function WorkshopSettingsSkeleton() {
  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="p-7">
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="w-full sm:w-1/2">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>

        <div className="mb-5.5">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-28 w-full" />
        </div>

        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="w-full sm:w-1/2">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>

        <div className="flex justify-end gap-4.5 pt-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
