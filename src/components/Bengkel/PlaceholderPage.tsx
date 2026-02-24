import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoService",
};

export default function PlaceholderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Module Under Development" />
      
      <div className="rounded-[10px] border border-stroke bg-white p-20 shadow-1 dark:border-dark-3 dark:bg-gray-dark text-center">
        <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">Halaman Sedang Dibuat</h3>
        <p className="text-dark-5 dark:text-dark-6">Modul ini akan segera tersedia sesuai rancangan di BENGKEL_WEB_PANEL_DESKRIPSI.md</p>
      </div>
    </div>
  );
}
