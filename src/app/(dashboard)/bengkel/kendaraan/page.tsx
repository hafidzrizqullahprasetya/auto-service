import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { VehicleTable } from "@/components/Bengkel/Kendaraan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kendaraan",
};

export default function KendaraanPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Kendaraan" />

      <div className="flex flex-col gap-10">
        <VehicleTable />
      </div>
    </div>
  );
}
