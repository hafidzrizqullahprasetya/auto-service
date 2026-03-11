import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { StockOpnameTable } from "@/features/inventori";

export const metadata: Metadata = {
  title: "Stok Opname",
};

export default function OpnamePage() {
  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Stok Opname" />
      <StockOpnameTable />
    </div>
  );
}
