"use client";

import { LOW_STOCK_ITEMS } from "@/mock/wa-notifications";
import { Icons } from "@/components/Icons";
import Link from "next/link";

export function LowStockAlert() {
  if (LOW_STOCK_ITEMS.length === 0) return null;

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
            <Icons.Notification size={16} className="text-red-500" />
          </div>
          <div>
            <h4 className="text-base font-bold text-dark dark:text-white">
              Alert Stok Menipis
            </h4>
            <p className="text-xs text-dark-5">
              {LOW_STOCK_ITEMS.length} item di bawah batas minimum
            </p>
          </div>
        </div>
        <Link
          href="/bengkel/inventori"
          className="text-xs font-bold text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {LOW_STOCK_ITEMS.map((item) => {
          const percent = Math.round((item.stock / item.minimumStock) * 100);
          return (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-lg border border-stroke bg-gray-1 px-4 py-3 dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-dark dark:text-white">{item.name}</p>
                <p className="font-mono text-[10px] text-dark-5">{item.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-500">
                  {item.stock}{" "}
                  <span className="font-medium text-dark-5 text-xs">/ min {item.minimumStock}</span>
                </p>
                {/* Progress bar */}
                <div className="mt-1 h-1 w-20 rounded-full bg-gray-3 dark:bg-dark-3">
                  <div
                    className="h-1 rounded-full bg-red-400"
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
