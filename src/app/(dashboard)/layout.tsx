import DashboardLayout from "@/components/layouts/DashboardLayout";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
