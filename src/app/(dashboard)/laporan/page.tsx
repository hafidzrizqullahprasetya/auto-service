import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { LaporanKeuangan } from "@/features/laporan";
import { LaporanAnalitik } from "@/features/laporan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan",
};

export default function LaporanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Laporan & Analitik" />
      <div className="flex flex-col gap-6">
        <LaporanKeuangan />
        <LaporanAnalitik />
      </div>
    </div>
  );
}
