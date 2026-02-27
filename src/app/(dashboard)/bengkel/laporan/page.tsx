import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { LaporanKeuangan, LaporanAnalitik } from "@/components/Bengkel/Laporan";
import { TransactionTable } from "@/components/Bengkel/Kasir";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
};

export default function LaporanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Laporan" />

      <div className="flex flex-col gap-6 md:gap-8">
        <LaporanKeuangan />
        <LaporanAnalitik />
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
}
