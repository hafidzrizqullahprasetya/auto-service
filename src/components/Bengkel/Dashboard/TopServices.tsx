import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getTopServicesData } from "@/mock/dashboard-charts";
import { Icons } from "@/components/icons";

export async function TopServices({ className }: { className?: string }) {
  const data = getTopServicesData();

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Jasa & Sparepart Terlaris
        </h2>
        <p className="text-xs font-medium text-dark-5">Item yang paling sering dipesan bulan ini</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center [&>th]:text-[11px] [&>th]:font-black [&>th]:tracking-wider">
            <TableHead className="!text-left">Nama Layanan / Part</TableHead>
            <TableHead>Total Order</TableHead>
            <TableHead className="!text-right">Trend</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, i) => (
            <TableRow
              className="text-center text-sm font-bold text-dark dark:text-white"
              key={item.name + i}
            >
              <TableCell className="flex items-center gap-3 !text-left">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-2 text-primary">
                   <Icons.Repair size={16} />
                </div>
                <div>
                   <p className="line-clamp-1">{item.name}</p>
                </div>
              </TableCell>

              <TableCell>
                <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs">
                  {item.count} Kali
                </span>
              </TableCell>

              <TableCell className={cn(
                "!text-right flex items-center justify-end gap-1",
                item.growth > 0 ? "text-green" : "text-red"
              )}>
                {item.growth > 0 ? "▲" : "▼"} {Math.abs(item.growth)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
