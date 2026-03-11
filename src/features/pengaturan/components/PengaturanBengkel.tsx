"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

import { useSettings } from "@/hooks/useSettings";
import { Notify } from "@/utils/notify";
import { type Role } from "@/lib/permissions";

import { ProfilTab } from "./tabs/ProfilTab";
import { OperasionalTab } from "./tabs/OperasionalTab";
import { WAGatewayTab } from "./tabs/WAGatewayTab";
import { ManajemenAkunTab } from "./tabs/ManajemenAkunTab";

type Tab = "bengkel" | "operasional" | "wa" | "akun";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "bengkel", label: "Profil Bengkel", icon: Icons.Dashboard },
  { id: "operasional", label: "Operasional", icon: Icons.Repair },
  { id: "wa", label: "WA Gateway", icon: Icons.Notification },
  { id: "akun", label: "Manajemen Akun", icon: Icons.Karyawan },
];

const VALID_TABS: Tab[] = ["bengkel", "operasional", "wa", "akun"];

export function PengaturanBengkel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    tabFromUrl && VALID_TABS.includes(tabFromUrl) ? tabFromUrl : "bengkel"
  );
  const [userRole, setUserRole] = useState<Role>("Kasir");
  const { data: settings, loading, refetch, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const handleSetTab = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/pengaturan?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as { role: Role };
        setUserRole(u.role);
      } catch {}
    }
  }, []);

  const handleTabSave = async (data: any) => {
    Notify.loading("Menyimpan Perubahan...");
    try {
      setSaving(true);
      await updateSettings(data);
      await refetch();
      Notify.toast("Pengaturan berhasil disimpan");
    } catch (err) {
      Notify.alert("Gagal", "Gagal menyimpan pengaturan", "error");
    } finally {
      setSaving(false);
    }
  };

  const visibleTabs = TABS.filter(
    (t) => t.id !== "akun" || userRole === "Owner" || userRole === "Admin",
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="no-scrollbar flex w-full md:w-fit gap-1 overflow-x-auto rounded-lg border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-dark-2">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSetTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-none whitespace-nowrap",
              activeTab === id
                ? "bg-dark text-white shadow-none dark:bg-white dark:text-dark"
                : "text-dark-5 hover:text-dark dark:hover:text-white",
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "bengkel" && (
        <ProfilTab
          settings={settings}
          onSave={handleTabSave}
          loading={loading}
          saving={saving}
        />
      )}
      {activeTab === "operasional" && (
        <OperasionalTab
          settings={settings}
          onSave={handleTabSave}
          loading={loading}
          saving={saving}
        />
      )}
      {activeTab === "wa" && (
        <WAGatewayTab
          settings={settings}
          onSave={handleTabSave}
          loading={loading}
          saving={saving}
        />
      )}
      {activeTab === "akun" && <ManajemenAkunTab userRole={userRole} />}
    </div>
  );
}
