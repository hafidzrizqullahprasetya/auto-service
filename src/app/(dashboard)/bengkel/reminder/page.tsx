import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReminderTable } from "@/components/Bengkel/ReminderTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reminder & Follow-up | Bengkel AutoService",
};

export default function ReminderPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Reminder & Follow-up" />
      <ReminderTable />
    </div>
  );
}
