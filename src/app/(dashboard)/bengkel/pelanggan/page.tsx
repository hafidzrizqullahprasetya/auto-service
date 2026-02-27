import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { CustomerTable } from "@/components/Bengkel/Pelanggan";
import { MOCK_CUSTOMERS } from "@/mock/customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelanggan",
};

export default function PelangganPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pelanggan" />

      <div className="flex flex-col gap-10">
        <CustomerTable data={MOCK_CUSTOMERS} />
      </div>
    </div>
  );
}
