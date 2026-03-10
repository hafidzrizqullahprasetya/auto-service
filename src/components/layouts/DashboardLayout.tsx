"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccess, ROLE_HOME } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (!stored) {
      router.replace("/auth/sign-in");
      return;
    }
    try {
      const user = JSON.parse(stored) as { role: Role };
      const ok = canAccess(user.role, pathname);
      if (!ok) {
        setAllowed(false);
        router.replace(ROLE_HOME[user.role]);
      } else {
        setAllowed(true);
      }
    } catch {
      router.replace("/auth/sign-in");
      return;
    }
    setReady(true);
  }, [pathname]);

  if (!ready || !allowed) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-2">
      {/* Sidebar — fixed width, full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-8">
          <div className="mx-auto max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
