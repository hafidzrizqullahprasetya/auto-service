import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PengaturanBengkel } from "@/features/pengaturan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function PengaturanPage() {
  return (
    <>
      <Breadcrumb pageName="Pengaturan" />
      <PengaturanBengkel />
    </>
  );
}
