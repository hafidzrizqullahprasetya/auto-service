"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VehicleTable } from "@/features/kendaraan";
import { VehicleMasterTable } from "@/features/vehicle-master";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

export default function KendaraanPage() {
  const [activeTab, setActiveTab] = useState<"unit" | "master">("unit");

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Breadcrumb pageName="Kendaraan" />
        
        <div className="flex rounded-xl border border-stroke bg-white p-1.5 shadow-sm dark:border-dark-3 dark:bg-dark-2">
          <button
            onClick={() => setActiveTab("unit")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
              activeTab === "unit" 
                ? "bg-dark text-white ring-4 ring-dark/5 dark:bg-white dark:text-dark dark:ring-white/5" 
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            )}
          >
            <Icons.KendaraanMobil size={18} />
            Unit Pelanggan
          </button>
          <button
            onClick={() => setActiveTab("master")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all",
              activeTab === "master" 
                ? "bg-dark text-white ring-4 ring-dark/5 dark:bg-white dark:text-dark dark:ring-white/5" 
                : "text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            )}
          >
            <Icons.Database size={18} />
            Data Master Merk
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {activeTab === "unit" ? <VehicleTable /> : <VehicleMasterTable />}
      </div>
    </div>
  );
}
