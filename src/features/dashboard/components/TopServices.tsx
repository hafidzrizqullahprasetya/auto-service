"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { formatNumber } from "@/utils/format-number";
import { api } from "@/lib/api";

import { TopServicesSkeleton } from "./TopServicesSkeleton";

interface TopServiceItem {
  name: string;
  total_qty: number;
}

export function TopServices({ className }: { className?: string }) {
  const [data, setData] = useState<TopServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const res = await api.get<TopServiceItem[]>("/reports/top-products?limit=5");
        setData((res.data || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to load top products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopProducts();
  }, []);

  if (loading) return <TopServicesSkeleton className={className} />;

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-dark dark:text-white">
          Jasa & Sparepart Terlaris
        </h2>
        <p className="text-xs font-medium text-dark-5">Item yang paling sering dipesan bulan ini</p>
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-dark-5">Belum ada data</TableCell>
            </TableRow>
          ) : data.slice(0, 5).map((item, i) => (
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
                  {formatNumber(item.total_qty)} Item
                </span>
              </TableCell>

              <TableCell className="!text-right text-dark-5 font-medium">
                -
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
