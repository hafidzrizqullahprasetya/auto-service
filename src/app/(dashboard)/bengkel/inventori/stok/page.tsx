import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { StockMovementPage } from "@/components/Bengkel/Inventori";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pergerakan Stok",
};

export default function StokPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pergerakan Stok" />
      <StockMovementPage />
    </div>
  );
}
