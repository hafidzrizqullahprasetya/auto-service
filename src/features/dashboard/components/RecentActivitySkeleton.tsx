import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function RecentActivitySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="mb-5.5 px-7.5">
        <Skeleton className="h-7 w-40" />
      </div>

      <div className="px-7.5">
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3" />
                <div className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="mt-8 h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
