"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import Link from "next/link";
import { api } from "@/lib/api";
import { LowStockAlertSkeleton } from "./LowStockAlertSkeleton";

interface LowStockItem {
  id: number;
  name: string;
  sku: string;
  current_stock: number;
  minimum_stock: number;
}

export function LowStockAlert() {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLowStock() {
      try {
        const res = await api.get<LowStockItem[]>("/api/v1/reports/low-stock");
        setItems(res.data || []);
      } catch (err) {
        console.error("Failed to fetch low stock", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLowStock();
  }, []);

  if (loading) return <LowStockAlertSkeleton />;

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red/5">
            <Icons.Notification size={16} className="text-red" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-dark dark:text-white">
              Alert Stok Menipis
            </h4>
            <p className="text-sm font-medium text-dark-5">
              {items.length} item di bawah batas minimum
            </p>
          </div>
        </div>
        <Link
          href="/inventori"
          className="text-xs font-bold text-primary hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green/10">
              <Icons.Success className="text-green" size={20} />
            </div>
            <p className="text-sm font-medium text-dark-5">Semua stok aman</p>
          </div>
        ) : items.map((item) => {
          const percent = Math.round((item.current_stock / (item.minimum_stock || 1)) * 100);
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
                  {item.current_stock}{" "}
                  <span className="font-medium text-dark-5 text-xs">/ min {item.minimum_stock}</span>
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
