import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { EmployeeTable } from "@/components/Bengkel/EmployeeTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Karyawan & Mekanik | Bengkel AutoService",
};

export default function KaryawanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Karyawan & Mekanik" />
      
      <div className="flex flex-col gap-10">
        <EmployeeTable />
      </div>
    </div>
  );
}
