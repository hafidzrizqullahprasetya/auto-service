import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import { CategoryList } from "@/features/inventori/components/CategoryList";

export const metadata: Metadata = {
  title: "Manajemen Kategori",
};

export default function CategoryPage() {
  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Manajemen Kategori" />
      <CategoryList />
    </div>
  );
}
