import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PurchaseOrderTable } from "@/features/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Order",
};

export default function PurchaseOrderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Purchase Order" />

      <PurchaseOrderTable />
    </div>
  );
}
