import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { LaporanKeuangan } from "@/components/Bengkel/LaporanKeuangan";
import { TransactionTable } from "@/components/Bengkel/TransactionTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Keuangan | Bengkel AutoService",
};

export default function LaporanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Laporan Keuangan" />
      <div className="flex flex-col gap-6 md:gap-8">
        <LaporanKeuangan />
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}
