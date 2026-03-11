import { Skeleton } from "@/components/ui/skeleton";
import { SectionCard } from "./SectionCard";

export function ManajemenAkunTabSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Alert Banner Skeleton */}
      <div className="flex items-center gap-4 rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-1.5 w-full">
           <Skeleton className="h-3 w-full max-w-md" />
           <Skeleton className="h-3 w-3/4 max-w-xs" />
        </div>
      </div>

      <SectionCard title="Daftar Akun Pengguna">
        <div className="mb-4 flex justify-end">
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16 rounded" />
                    <Skeleton className="h-1 w-1 rounded-full" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-stroke pt-3 sm:border-0 sm:pt-0 sm:justify-end gap-4">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Permission Editor Skeleton (Assume it might be visible) */}
      <SectionCard title="Pengaturan Izin Akses">
        <div className="space-y-2 mb-6">
          <Skeleton className="h-3 w-full max-w-lg" />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 border-b border-stroke pb-2 dark:border-dark-3">
             <Skeleton className="h-4 w-20" />
             <Skeleton className="h-4 w-12 mx-auto" />
             <Skeleton className="h-4 w-12 mx-auto" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 py-2 border-b border-stroke last:border-0 dark:border-dark-3">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-5 w-5 rounded mx-auto" />
               <Skeleton className="h-5 w-5 rounded mx-auto" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </SectionCard>
    </div>
  );
}
