import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { InventoryTable } from "@/components/Bengkel/InventoryTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventori & Stok | Bengkel AutoService",
};

export default function InventoriPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Inventori & Stok" />
      
      <div className="flex flex-col gap-10">
        <InventoryTable />
      </div>
    </div>
  );
}
