import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReminderTable } from "@/components/Bengkel/shared";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reminder",
};

export default function ReminderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Reminder" />

      <ReminderTable />
    </div>
  );
}
