"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomerTable } from "@/features/pelanggan";

export default function PelangganPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pelanggan" />

      <div className="flex flex-col gap-10">
        <CustomerTable />
      </div>
    </div>
  );
}
