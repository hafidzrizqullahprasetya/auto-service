import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomerTable } from "@/components/Bengkel/CustomerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Pelanggan | Bengkel AutoService",
};

export default function PelangganPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Data Pelanggan" />
      
      <div className="flex flex-col gap-10">
        <CustomerTable />
      </div>
    </div>
  );
}
