import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function TopServicesSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card", className)}>
      <div className="mb-4">
        <Skeleton className="h-7 w-56 mb-1" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none [&>th]:text-center [&>th]:text-xs [&>th]:font-bold [&>th]:text-dark-5">
            <TableHead className="!text-left">Nama Layanan / Part</TableHead>
            <TableHead>Total Order</TableHead>
            <TableHead className="!text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow className="text-center text-sm font-bold" key={i}>
              <TableCell className="flex items-center gap-3 !text-left">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="mx-auto h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="!text-right">
                <Skeleton className="ml-auto h-4 w-8" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
