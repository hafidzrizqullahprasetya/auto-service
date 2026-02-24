import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseOrderTable } from "@/components/Bengkel/PurchaseOrderTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Order | Bengkel AutoService",
};

export default function PurchaseOrderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pemesanan Stok (PO)" />
      <PurchaseOrderTable />
    </div>
  );
}
