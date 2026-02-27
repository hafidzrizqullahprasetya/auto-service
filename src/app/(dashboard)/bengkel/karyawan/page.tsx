import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeeTable } from "@/components/Bengkel/Karyawan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karyawan",
};

export default function KaryawanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Karyawan" />

      <div className="flex flex-col gap-10">
        <EmployeeTable />
      </div>
    </div>
  );
}
