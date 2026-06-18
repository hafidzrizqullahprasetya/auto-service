"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CustomerTableSkeleton() {
  return (
    <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex flex-col gap-4 border-b border-stroke px-6 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      <div className="p-4">
        {/* Table Header Placeholder */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-5 gap-4 px-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16 justify-self-end sm:justify-self-auto sm:w-32 hidden sm:block" />
          <Skeleton className="h-4 w-24 hidden sm:block" />
          <Skeleton className="h-4 w-40 hidden sm:block" />
          <Skeleton className="h-4 w-16 text-right justify-self-end" />
        </div>

        {/* Table Rows Placeholder */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-2 sm:grid-cols-5 items-center gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 sm:hidden" />
              </div>
              
              <div className="hidden sm:block">
                <Skeleton className="h-4 w-40" />
              </div>
              
              <Skeleton className="h-4 w-32 hidden sm:block" />
              
              <div className="flex gap-2 hidden sm:flex">
                 <Skeleton className="h-5 w-20 rounded-full" />
                 <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              
              <div className="flex justify-end gap-2">
                {/* On mobile, show just one action skeleton, on desktop show two */}
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg hidden sm:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
