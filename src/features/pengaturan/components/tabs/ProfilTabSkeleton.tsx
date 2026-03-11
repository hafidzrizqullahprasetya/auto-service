import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "./SectionCard";

export function ProfilTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Identitas Bengkel">
        <div className="mb-6 flex items-center gap-5">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-8 w-24 mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </SectionCard>
      
      <div className="flex justify-end mt-4">
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  );
}
