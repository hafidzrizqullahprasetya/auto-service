import { Skeleton } from "@/components/ui/skeleton";

export function CartItemSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-stroke py-3 last:border-0 dark:border-dark-3">
      <div className="flex-1 pr-4">
        <Skeleton className="mb-1.5 h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  );
}

export function CartSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
    </div>
  );
}
