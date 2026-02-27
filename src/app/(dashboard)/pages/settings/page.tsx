import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import { WorkshopSettings } from "@/components/Bengkel/Dashboard/WorkshopSettings";
import { UploadPhotoForm } from "./_components/upload-photo";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Pengaturan Bengkel" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <WorkshopSettings />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="space-y-8">
             <UploadPhotoForm />
             {/* Additional workshop specific settings can go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

