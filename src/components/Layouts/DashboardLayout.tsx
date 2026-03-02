"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import type { PropsWithChildren } from "react";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-2">
      {/* Sidebar — fixed width, full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-8">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
