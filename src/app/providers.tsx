"use client";

import { SidebarProvider } from "@/components/layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <SidebarProvider>
        {children}
        <Toaster position="top-center" />
      </SidebarProvider>
    </ThemeProvider>
  );
}
