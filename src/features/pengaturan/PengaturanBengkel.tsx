"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { KatalogJasa } from "@/features/kasir/KatalogJasa";

import { useEmployees } from "@/hooks/useEmployees";
import { useSettings } from "@/hooks/useSettings";
import { Badge } from "@/features/shared";
import Skeleton from "react-loading-skeleton";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import {
  PERMISSION_ROUTES,
  DEFAULT_PERMISSIONS,
  getPermissions,
  savePermissions,
  type Role,
} from "@/lib/permissions";

type Tab = "bengkel" | "operasional" | "invoice" | "katalog" | "wa" | "akun";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "bengkel", label: "Profil Bengkel", icon: Icons.Dashboard },
  { id: "operasional", label: "Operasional", icon: Icons.Repair },
  { id: "invoice", label: "Pengaturan Invoice", icon: Icons.Print },
  { id: "katalog", label: "Katalog Jasa", icon: Icons.Kasir },
  { id: "wa", label: "WA Gateway", icon: Icons.Notification },
  { id: "akun", label: "Manajemen Akun", icon: Icons.Karyawan },
];

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  loading,
}: {
  label: string;
  type?: string;
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-gray-2 dark:bg-dark-3 animate-pulse" />
        <div className="h-10 w-full rounded-lg bg-gray-2 dark:bg-dark-3 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
      />
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-stroke bg-white shadow-none dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
        <h3 className="text-base font-bold text-dark dark:text-white">
          {title}
        </h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ProfilTab({ settings, setSettings, loading }: { settings: any, setSettings: (val: any) => void, loading: boolean }) {
  const updateField = (field: string, val: string) => {
    setSettings({ ...settings, [field]: val });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Identitas Bengkel">
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-stroke bg-gray-2 dark:border-dark-4 dark:bg-dark-3">
             {loading ? <Skeleton height={80} width={80} /> : <Icons.Dashboard size={30} className="text-dark-5" />}
          </div>
          <div>
            <p className="text-sm font-bold text-dark dark:text-white">
              Logo Bengkel
            </p>
            <p className="mt-1 text-xs font-medium text-dark-5">
              PNG, JPG MAKS 2MB · 500×500PX
            </p>
            <button className="mt-3 rounded-lg border-2 border-dark bg-dark px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white">
              GANTI LOGO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Nama Bengkel"
            value={settings?.name}
            onChange={(v) => updateField("name", v)}
            loading={loading}
          />
          <InputField
            label="Nomor Telepon / WA"
            value={settings?.phone}
            onChange={(v) => updateField("phone", v)}
            loading={loading}
          />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
            Alamat Operasional
          </label>
          {loading ? (
            <div className="h-24 w-full rounded-lg bg-gray-2 dark:bg-dark-3 animate-pulse" />
          ) : (
            <textarea
              rows={3}
              value={settings?.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full resize-none rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function PermissionEditor() {
  const [perms, setPerms] = useState(() => getPermissions());
  const [saved, setSaved] = useState(false);

  const toggle = (role: "Admin" | "Kasir", route: string) => {
    setPerms((prev) => {
      const current = prev[role] ?? [...DEFAULT_PERMISSIONS[role]];
      const next = current.includes(route)
        ? current.filter((r) => r !== route)
        : [...current, route];
      return { ...prev, [role]: next };
    });
    setSaved(false);
  };

  const handleSave = () => {
    savePermissions(perms);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <SectionCard title="Pengaturan Izin Akses">
      <p className="mb-4 text-xs font-medium text-dark-5">
        Centang halaman yang boleh diakses oleh masing-masing role. Owner selalu
        memiliki akses penuh.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stroke dark:border-dark-3">
              <th className="pb-2 text-left text-xs font-black uppercase tracking-wider text-dark-5">
                Halaman
              </th>
              <th className="w-20 pb-2 text-center text-xs font-black uppercase tracking-wider text-blue-600">
                Admin
              </th>
              <th className="w-20 pb-2 text-center text-xs font-black uppercase tracking-wider text-amber-600">
                Kasir
              </th>
            </tr>
          </thead>
          <tbody>
            {PERMISSION_ROUTES.filter((p) => p.route !== "/").map((p) => (
              <tr
                key={p.route}
                className="border-b border-stroke last:border-0 dark:border-dark-3"
              >
                <td className="py-2.5 text-xs font-semibold text-dark dark:text-white">
                  {p.label}
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={(
                      perms.Admin ?? DEFAULT_PERMISSIONS.Admin
                    ).includes(p.route)}
                    onChange={() => toggle("Admin", p.route)}
                    className="size-4 cursor-pointer accent-dark"
                  />
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={(
                      perms.Kasir ?? DEFAULT_PERMISSIONS.Kasir
                    ).includes(p.route)}
                    onChange={() => toggle("Kasir", p.route)}
                    className="size-4 cursor-pointer accent-dark"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleSave}
          className="rounded-lg border-2 border-dark bg-dark px-6 py-2 text-xs font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white"
        >
          Simpan Izin
        </button>
        {saved && (
          <span className="text-xs font-bold text-green-600">Tersimpan!</span>
        )}
      </div>
    </SectionCard>
  );
}

function ManajemenAkunTab({ userRole }: { userRole: Role }) {
  const [showForm, setShowForm] = useState(false);
  const { data: employees, loading } = useEmployees();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2 rounded-lg border border-stroke bg-gray-1 px-4 py-3 text-xs text-dark-5 dark:border-dark-3 dark:bg-dark-2">
        <Icons.Lock size={13} className="mt-0.5 shrink-0" />
        <span>
          Hanya <strong className="text-dark dark:text-white">Owner</strong> dan{" "}
          <strong className="text-dark dark:text-white">Admin</strong> yang
          dapat menambah atau mengubah akun pengguna.
        </span>
      </div>

      <SectionCard title="Daftar Akun Pengguna">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg border-2 border-dark bg-dark px-5 py-2 text-xs font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white"
          >
            + Tambah Akun
          </button>
        </div>

        {showForm && (
          <div className="mb-5 rounded-lg border-2 border-dashed border-stroke p-5 dark:border-dark-3">
            <p className="mb-4 text-sm font-bold text-dark dark:text-white">
              Akun Baru
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField label="Nama Lengkap" placeholder="Nama pengguna" />
              <InputField
                label="Username"
                placeholder="username (huruf kecil, tanpa spasi)"
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 8 karakter"
              />
              <div>
                <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
                  Role
                </label>
                <select className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                  <option value="admin">Admin</option>
                  <option value="kasir">Kasir</option>
                </select>
                <p className="mt-1 text-[10px] text-dark-5">
                  Owner hanya bisa dibuat langsung di sistem.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg border-2 border-dark bg-dark px-6 py-2 text-xs font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white">
                Simpan Akun
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border-2 border-stroke px-6 py-2 text-xs font-bold text-dark transition-all hover:bg-gray-1 dark:border-dark-3 dark:text-white"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 dark:border-dark-3 animate-pulse">
                 <div className="flex items-center gap-3">
                   <div className="h-9 w-9 rounded-lg bg-gray-2 dark:bg-dark-3" />
                   <div className="space-y-2">
                     <div className="h-4 w-32 rounded bg-gray-2 dark:bg-dark-3" />
                     <div className="h-3 w-20 rounded bg-gray-2 dark:bg-dark-3" />
                   </div>
                 </div>
                 <div className="h-6 w-16 rounded-full bg-gray-2 dark:bg-dark-3" />
               </div>
             ))
          ) : employees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center justify-between rounded-lg border border-stroke px-4 py-3 dark:border-dark-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-2">
                  <Icons.Karyawan size={16} className="text-dark-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark dark:text-white">
                    {emp.name}
                  </p>
                  <p className="text-[10px] font-medium text-dark-5">
                    {emp.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    emp.role === "Owner"
                      ? "neutral"
                      : emp.role === "Admin"
                        ? "info"
                        : "warning"
                  }
                  className="text-[10px] font-bold"
                >
                  {emp.role}
                </Badge>
                {emp.role !== "Owner" && (
                  <button className="text-[10px] font-bold text-dark-5 underline hover:text-dark dark:hover:text-white">
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Permission editor — hanya Owner */}
      {userRole === "Owner" && <PermissionEditor />}
    </div>
  );
}

function WAGatewayTab({ settings, setSettings, loading }: { settings: any, setSettings: (val: any) => void, loading: boolean }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const updateField = (field: string, val: string) => {
    setSettings({ ...settings, [field]: val });
  };

  useEffect(() => {
    async function fetchWaLogs() {
      try {
        const { api } = await import("@/lib/api");
        const res = await api.get<any[]>("/api/v1/notifications/wa");
        setLogs(res.data || []);
      } catch (err) {
        console.error("Failed to load WA logs", err);
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchWaLogs();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Konfigurasi WhatsApp Gateway">
        <div className="mb-4 rounded-lg border border-stroke bg-gray-1 p-3 text-xs text-dark-5 dark:border-dark-3 dark:bg-dark-2">
          <p>
            WA Gateway digunakan untuk mengirim notifikasi otomatis ke pelanggan
            dan monitoring stok.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Nomor WA Penerima"
            value={settings?.wa_target_number}
            onChange={(v) => updateField("wa_target_number", v)}
            placeholder="+62 812-xxxx-xxxx"
            loading={loading}
          />
          <InputField
            label="API Gateway Token"
            type="password"
            value={settings?.wa_gateway_token}
            onChange={(v) => updateField("wa_gateway_token", v)}
            placeholder="Token dari provider..."
            loading={loading}
          />
        </div>
      </SectionCard>

      <SectionCard title="Log Notifikasi WA">
        <div className="flex flex-col gap-2">
          {loadingLogs ? (
             Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="flex items-start justify-between gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3 animate-pulse">
                 <div className="flex-1 space-y-2">
                   <div className="h-4 w-40 rounded bg-gray-2 dark:bg-dark-3" />
                   <div className="h-3 w-full rounded bg-gray-2 dark:bg-dark-3" />
                   <div className="h-3 w-24 rounded bg-gray-2 dark:bg-dark-3" />
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <div className="h-5 w-16 rounded bg-gray-2 dark:bg-dark-3" />
                   <div className="h-3 w-20 rounded bg-gray-2 dark:bg-dark-3" />
                 </div>
               </div>
             ))
          ) : logs.length === 0 ? (
             <p className="text-sm text-dark-5 py-4 text-center">Belum ada riwayat notifikasi WA</p>
          ) : logs.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-dark dark:text-white">
                  {notif.spare_parts?.name || "Notifikasi Sistem"}
                </p>
                {notif.spare_parts?.sku && (
                  <p className="font-mono text-[10px] text-dark-5">{notif.spare_parts.sku}</p>
                )}
                <p className="mt-1 text-xs text-dark-5 line-clamp-1" title={notif.message_body}>
                  {notif.message_body}
                </p>
                <p className="mt-1 text-xs font-medium text-dark-5">
                  Tujuan: <span className="text-secondary">{notif.wa_number}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  variant={
                    notif.status === "sent"
                      ? "success"
                      : notif.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                  className="text-[10px]"
                >
                  {notif.status === "sent"
                    ? "Terkirim"
                    : notif.status === "pending"
                      ? "Menunggu"
                      : "Gagal"}
                </Badge>
                <p className="text-[10px] text-dark-5">
                  {notif.sent_at
                    ? dayjs(notif.sent_at).format("DD/MM/YY HH:mm")
                    : dayjs(notif.created_at).format("DD/MM/YY HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function OperasionalTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Jam Operasional">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Jam Buka" type="time" value="08:00" />
          <InputField label="Jam Tutup" type="time" value="17:00" />
        </div>
        <div className="mt-5">
          <p className="mb-3 text-sm font-bold text-dark dark:text-white">
            Hari Operasional
          </p>
          <div className="flex flex-wrap gap-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => {
              const active = i < 6; // default Mon–Sat
              return (
                <button
                  key={d}
                  className={cn(
                    "rounded-lg border-2 px-5 py-2 text-sm font-bold transition-all",
                    active
                      ? "border-dark bg-dark text-white dark:border-white dark:bg-white dark:text-dark"
                      : "border-stroke text-dark-5 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-2",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function EmptyTab({ title }: { title: string }) {
  return (
    <SectionCard title={title}>
      <div className="rounded-lg border-2 border-dashed border-stroke py-10 text-center dark:border-dark-3">
        <p className="text-sm text-dark-5">Konfigurasi ini akan segera tersedia.</p>
      </div>
    </SectionCard>
  );
}

export function PengaturanBengkel() {
  const [activeTab, setActiveTab] = useState<Tab>("bengkel");
  const [userRole, setUserRole] = useState<Role>("Kasir");
  const { data: initialSettings, loading, updateSettings } = useSettings();
  const [localSettings, setLocalSettings] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as { role: Role };
        setUserRole(u.role);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
    }
  }, [initialSettings]);

  const handleCommit = async () => {
    try {
      setSaving(true);
      await updateSettings(localSettings);
      toast.success("Pengaturan berhasil disimpan");
    } catch (err) {
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  const visibleTabs = TABS.filter(
    (t) => t.id !== "akun" || userRole === "Owner" || userRole === "Admin",
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-fit gap-1 rounded-lg bg-gray-1 p-1 dark:bg-dark-2">
        {visibleTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-none",
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
          settings={localSettings}
          setSettings={setLocalSettings}
          loading={loading}
        />
      )}
      {activeTab === "operasional" && <OperasionalTab />}
      {activeTab === "invoice" && <EmptyTab title="Pengaturan Invoice" />}
      {activeTab === "katalog" && <KatalogJasa />}
      {activeTab === "wa" && (
        <WAGatewayTab
          settings={localSettings}
          setSettings={setLocalSettings}
          loading={loading}
        />
      )}
      {activeTab === "akun" && <ManajemenAkunTab userRole={userRole} />}

      {activeTab !== "katalog" &&
        activeTab !== "wa" &&
        activeTab !== "akun" && (
          <div className="mt-4 flex justify-end gap-3">
             <button 
              disabled={saving}
              onClick={handleCommit}
              className="rounded-lg border-2 border-dark bg-dark px-10 py-3 text-sm font-bold text-white shadow-none transition-all hover:bg-white hover:text-dark active:scale-100 disabled:opacity-50 dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white"
            >
              {saving ? "Simpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}

      {activeTab === "wa" && (
        <div className="flex justify-end mt-4">
           <button 
            disabled={saving}
            onClick={handleCommit}
            className="rounded-lg border-2 border-dark bg-dark px-10 py-3 text-sm font-bold text-white shadow-none transition-all hover:bg-white hover:text-dark active:scale-100 disabled:opacity-50 dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white"
          >
            {saving ? "Simpan..." : "Simpan Gateway"}
          </button>
        </div>
      )}
    </div>
  );
}
