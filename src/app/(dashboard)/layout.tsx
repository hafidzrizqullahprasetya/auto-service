import DashboardLayout from "@/components/Layouts/DashboardLayout";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
