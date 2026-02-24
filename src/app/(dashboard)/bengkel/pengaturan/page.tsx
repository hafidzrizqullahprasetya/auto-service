import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PengaturanBengkel } from "@/components/Bengkel/PengaturanBengkel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan | Bengkel AutoService",
};

export default function PengaturanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pengaturan Bengkel" />
      <PengaturanBengkel />
    </div>
  );
}
