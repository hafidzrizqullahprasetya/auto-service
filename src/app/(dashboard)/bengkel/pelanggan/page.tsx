"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomerTable } from "@/components/Bengkel/Pelanggan";
import { useCustomers } from "@/hooks/useCustomers";

export default function PelangganPage() {
  const { data, loading, error, refetch } = useCustomers();

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pelanggan" />

      <div className="flex flex-col gap-10">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
            ⚠ {error}{" "}
            <button onClick={refetch} className="underline">
              Coba Lagi
            </button>
          </div>
        )}
        <CustomerTable data={loading ? [] : data} />
      </div>
    </div>
  );
}
