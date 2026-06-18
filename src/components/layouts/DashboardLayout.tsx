"use client";

import { Sidebar } from "@/components/layouts/sidebar";
import { Header } from "@/components/layouts/header";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { canAccess, ROLE_HOME } from "@/lib/permissions";
import type { Role } from "@/lib/permissions";
import { Notify } from "@/utils/notify";
import { AccessDeniedView } from "@/components/layouts/AccessDeniedView";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (!stored) {
      router.replace("/auth/sign-in");
      return;
    }
    try {
      const user = JSON.parse(stored) as { role: Role };
      setUserRole(user.role);
      const ok = canAccess(user.role, pathname);
      if (!ok) {
        setAllowed(false);
      } else {
        setAllowed(true);
        const welcomeMsg = sessionStorage.getItem("welcome_toast");
        if (welcomeMsg) {
          sessionStorage.removeItem("welcome_toast");
          setTimeout(() => Notify.toast(welcomeMsg, "success", "top"), 200);
        }
      }
    } catch {
      router.replace("/auth/sign-in");
      return;
    }
    setReady(true);
  }, [pathname]);

  if (!ready) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-2">
      {/* Sidebar — fixed width, full height */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 2xl:p-8">
          <div className="mx-auto max-w-screen-2xl">
            {allowed ? children : <AccessDeniedView homeRoute={userRole ? ROLE_HOME[userRole] : "/"} />}
          </div>
        </main>
      </div>
    </div>
  );
}
