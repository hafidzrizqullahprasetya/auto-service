import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { StockMovementTable } from "@/features/inventori";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pergerakan Stok",
};

export default function StokPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pergerakan Stok" />
      <StockMovementTable />
    </div>
  );
}
