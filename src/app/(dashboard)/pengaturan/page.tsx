import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PengaturanBengkel } from "@/features/pengaturan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function PengaturanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Pengaturan" />

      <PengaturanBengkel />
    </div>
  );
}
