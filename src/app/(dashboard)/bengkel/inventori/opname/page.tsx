import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { StockOpnamePage } from "@/components/Bengkel/Inventori";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stok Opname",
};

export default function OpnamePage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Stok Opname" />
      <StockOpnamePage />
    </div>
  );
}
