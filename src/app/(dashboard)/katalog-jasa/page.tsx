import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { KatalogJasa } from "@/features/kasir";

export const metadata: Metadata = {
  title: "Katalog Jasa | Auto Service",
  description: "Kelola daftar layanan dan jasa yang ditawarkan bengkel",
};

export default function KatalogJasaPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Katalog Jasa" />
      <KatalogJasa />
    </div>
  );
}
