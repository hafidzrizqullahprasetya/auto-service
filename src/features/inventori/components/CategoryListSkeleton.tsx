"use client";

export function CategoryListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Stat Area Mockup - similar to DataTable structure */}
      <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="animate-pulse bg-neutral-100 dark:bg-dark-2 size-12 rounded-xl"></div>
            <div>
              <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-5 w-40"></div>
              <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 mt-1.5 h-3 w-64"></div>
            </div>
          </div>
          <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-10 w-full sm:w-40"></div>
        </div>
      </div>

      {/* Table Area */}
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-stroke dark:border-dark-3 flex justify-between items-center">
          <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-10 w-64"></div>
          <div className="flex gap-2">
            <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-10 w-10"></div>
            <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-10 w-10"></div>
          </div>
        </div>

        {/* Table Rows */}
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b border-stroke last:border-0 dark:border-dark-3">
              <div className="flex items-center gap-4 flex-1">
                <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-4 w-8"></div>
                <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-5 w-48"></div>
              </div>
              <div className="flex justify-end gap-2 w-20">
                <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-8 w-8"></div>
                <div className="animate-pulse rounded-md bg-neutral-100 dark:bg-dark-2 h-8 w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
