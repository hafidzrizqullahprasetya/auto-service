import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "./SectionCard";

export function OperasionalTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Jam Operasional">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
        
        <div className="mt-6">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-16 rounded-lg" />
            ))}
          </div>
        </div>
      </SectionCard>
      
      <div className="flex justify-end mt-4">
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );
}
