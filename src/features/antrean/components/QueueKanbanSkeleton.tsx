import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const STATUS_COLUMNS = [
  "Menunggu",
  "Dikerjakan",
  "Menunggu Sparepart",
  "Selesai",
];

export function QueueKanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATUS_COLUMNS.map((status) => (
        <div key={status} className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-stroke pb-3 dark:border-dark-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-5 rounded-lg" />
          </div>

          <div className="flex min-h-[500px] flex-col gap-4 py-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark"
              >
                <div className="mb-4 flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <div className="space-y-2 border-y border-stroke py-3 dark:border-dark-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-8 w-full mt-3 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
