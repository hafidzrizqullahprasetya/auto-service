"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { KatalogJasa } from "@/features/kasir/KatalogJasa";

import { MOCK_WA_NOTIFICATIONS } from "@/mock/wa-notifications";
import { useEmployees } from "@/hooks/useEmployees";
import { Badge } from "@/features/shared";
import dayjs from "dayjs";
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
  defaultValue,
  placeholder,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
      />
    </div>
  );
}

function SelectField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
        {label}
      </label>
      <select className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
        {children}
      </select>
    </div>
  );
}

function ToggleField({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between border-b border-stroke py-4 last:border-0 dark:border-dark-3">
      <div>
        <p className="text-sm font-bold text-dark dark:text-white">{label}</p>
        {description && (
          <p className="mt-1 text-xs font-medium text-dark-5">{description}</p>
        )}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative h-6 w-12 rounded-lg border-2 border-stroke bg-gray-1 dark:bg-dark-2",
          checked
            ? "border-dark bg-dark dark:border-white dark:bg-white"
            : "bg-gray-2 dark:bg-dark-3",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-5 rounded-md shadow-none",
            checked
              ? "right-0.5 bg-white dark:bg-dark"
              : "left-0.5 bg-dark dark:bg-white",
          )}
        />
      </button>
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

function ProfilTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Identitas Bengkel">
        {/* Logo Upload */}
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-stroke bg-gray-2 dark:border-dark-4 dark:bg-dark-3">
            <Icons.Dashboard size={30} className="text-dark-5" />
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
            defaultValue="AutoService Premium Garage"
          />
          <InputField
            label="Nomor Telepon / WA"
            defaultValue="+62 812-3456-7890"
          />
          <InputField
            label="Email Address"
            type="email"
            defaultValue="info@autoservice.id"
          />
          <InputField
            label="Website Office"
            defaultValue="www.autoservice.id"
          />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
            Alamat Operasional
          </label>
          <textarea
            rows={3}
            defaultValue="Jl. Otomotif No. 123, Kawasan Industri Otomotif, Jakarta Selatan, DKI Jakarta 12345."
            className="w-full resize-none rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="NPWP" defaultValue="12.345.678.9-012.000" />
          <InputField
            label="Nomor Izin Usaha (SIUP)"
            defaultValue="503/1234/SIUP/2023"
          />
        </div>
      </SectionCard>

      <SectionCard title="Media Sosial">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Instagram" placeholder="@autoservice.id" />
          <InputField label="Facebook" placeholder="fb.com/autoservice" />
          <InputField
            label="WhatsApp Business"
            defaultValue="+62 812-3456-7890"
          />
          <InputField
            label="Google Maps Link"
            placeholder="https://goo.gl/maps/..."
          />
        </div>
      </SectionCard>
    </div>
  );
}

/** Editor izin akses per-route untuk Admin dan Kasir, hanya tampil ke Owner */
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
  const { data: employees } = useEmployees();

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
          {employees.map((emp) => (
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

function WAGatewayTab() {
  const [waNumber, setWaNumber] = useState("+62 812-3456-7890");
  const [waToken, setWaToken] = useState("");
  const [provider, setProvider] = useState("fonnte");

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Konfigurasi WhatsApp Gateway">
        <div className="mb-4 rounded-lg border border-stroke bg-gray-1 p-3 text-xs text-dark-5 dark:border-dark-3 dark:bg-dark-2">
          <p>
            WA Gateway digunakan untuk mengirim notifikasi otomatis ke pemilik
            bengkel saat stok sparepart mencapai batas minimum. Gunakan layanan
            seperti <strong>Fonnte</strong> atau{" "}
            <strong>WA Business API</strong>.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
              Provider Gateway
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="fonnte">FO-NNTE</option>
              <option value="wablas">WA-BLAS</option>
              <option value="wa_business">WA-BUSINESS-API</option>
              <option value="custom">CUSTOM-API-GATEWAY</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
              Nomor WA Penerima
            </label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-dark dark:text-white">
            API Secret Key
          </label>
          <input
            type="password"
            value={waToken}
            onChange={(e) => setWaToken(e.target.value)}
            placeholder="Key dari provider..."
            className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 font-mono text-sm font-black tracking-widest text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button className="rounded-lg border-2 border-dark bg-dark px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white">
            Simpan & Test Gateway
          </button>
          <button className="rounded-lg border-2 border-stroke px-6 py-2.5 text-sm font-bold text-dark transition-all hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2">
            Reset Option
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Log Notifikasi WA">
        <div className="flex flex-col gap-2">
          {MOCK_WA_NOTIFICATIONS.map((notif) => (
            <div
              key={notif.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-dark dark:text-white">
                  {notif.sparePartName}
                </p>
                <p className="font-mono text-[10px] text-dark-5">{notif.sku}</p>
                <p className="mt-1 text-xs text-dark-5">
                  Stok:{" "}
                  <span className="font-bold text-secondary">
                    {notif.currentStock}
                  </span>{" "}
                  / Min: {notif.minimumStock}
                  {" · "} Ke: {notif.waNumber}
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
                  {notif.sentAt
                    ? dayjs(notif.sentAt).format("DD/MM/YY HH:mm")
                    : "—"}
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
          <InputField label="Jam Buka" type="time" defaultValue="08:00" />
          <InputField label="Jam Tutup" type="time" defaultValue="17:00" />
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

      <SectionCard title="Konfigurasi Sistem">
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Tarif PPN (%)" type="number" defaultValue="11" />
          <SelectField label="Mata Uang">
            <option value="IDR">IDR – Rupiah (Rp)</option>
            <option value="USD">USD – Dollar ($)</option>
          </SelectField>
          <InputField
            label="Kapasitas Bay Servis"
            type="number"
            defaultValue="6"
          />
          <SelectField label="Format Nomor Invoice">
            <option>INV/YYYYMMDD/###</option>
            <option>INV-####</option>
            <option>Custom</option>
          </SelectField>
        </div>
        <div>
          <ToggleField
            label="Notifikasi Reminder Otomatis"
            description="Kirim WA otomatis saat jadwal servis mendekati"
            defaultChecked={true}
          />
          <ToggleField
            label="Alert Stok Menipis"
            description="Notifikasi ketika stok item mencapai batas minimum"
            defaultChecked={true}
          />
          <ToggleField
            label="Garansi Servis Default"
            description="Aktifkan garansi 3 bulan di setiap servis baru"
            defaultChecked={false}
          />
          <ToggleField
            label="Mode Gelap Otomatis"
            description="Sesuaikan tema dengan pengaturan sistem perangkat"
            defaultChecked={false}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function InvoiceTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Template Invoice">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Catatan Footer Invoice"
            defaultValue="Terima kasih telah mempercayakan kendaraan Anda kepada kami."
          />
          <InputField
            label="Syarat & Ketentuan Garansi"
            defaultValue="Garansi berlaku 3 bulan sejak tanggal servis."
          />
          <SelectField label="Warna Tema Invoice">
            <option>Biru (Default)</option>
            <option>Merah</option>
            <option>Hijau</option>
            <option>Hitam & Putih</option>
          </SelectField>
          <SelectField label="Ukuran Kertas Cetak">
            <option>A4</option>
            <option>Letter (USA)</option>
            <option>Thermal 80mm</option>
          </SelectField>
        </div>
        <div className="mt-4">
          <ToggleField
            label="Tampilkan Logo di Invoice"
            description="Logo bengkel akan muncul di header invoice"
            defaultChecked={true}
          />
          <ToggleField
            label="Tampilkan Barcode / QR di Invoice"
            description="QR code untuk verifikasi keaslian invoice"
            defaultChecked={false}
          />
          <ToggleField
            label="Tampilkan Rincian Pajak"
            description="Breakdown PPN ditampilkan di invoice"
            defaultChecked={true}
          />
        </div>
      </SectionCard>

      {/* Preview */}
      <SectionCard title="Preview Invoice Visual">
        <div className="rounded-lg border-2 border-dashed border-stroke bg-gray-1 p-10 text-center text-dark-5 dark:border-dark-3 dark:bg-dark-2">
          <Icons.Print size={40} className="mx-auto mb-4 opacity-10" />
          <p className="mt-2 text-sm font-medium text-dark-5">
            Live billing preview unavailable
          </p>
          <button className="mt-6 rounded-lg border-2 border-dark bg-dark px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white">
            Generate Preview PDF
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

export function PengaturanBengkel() {
  const [activeTab, setActiveTab] = useState<Tab>("bengkel");
  const [userRole, setUserRole] = useState<Role>("Kasir");

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const u = JSON.parse(stored) as { role: Role };
        setUserRole(u.role);
      } catch {}
    }
  }, []);

  // Kasir tidak bisa akses tab Manajemen Akun
  const visibleTabs = TABS.filter(
    (t) => t.id !== "akun" || userRole === "Owner" || userRole === "Admin",
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation */}
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

      {/* Tab Content */}
      {activeTab === "bengkel" && <ProfilTab />}
      {activeTab === "operasional" && <OperasionalTab />}
      {activeTab === "invoice" && <InvoiceTab />}
      {activeTab === "katalog" && <KatalogJasa />}
      {activeTab === "wa" && <WAGatewayTab />}
      {activeTab === "akun" && <ManajemenAkunTab userRole={userRole} />}

      {/* Save Button — only for form tabs */}
      {activeTab !== "katalog" &&
        activeTab !== "wa" &&
        activeTab !== "akun" && (
          <div className="mt-4 flex justify-end gap-3">
            <button className="rounded-lg border-2 border-stroke px-6 py-3 text-sm font-bold text-dark transition-all hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2">
              Reset Default
            </button>
            <button className="rounded-lg border-2 border-dark bg-dark px-10 py-3 text-sm font-bold text-white shadow-none transition-all hover:bg-white hover:text-dark active:scale-100 dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white">
              Commit Changes
            </button>
          </div>
        )}
    </div>
  );
}
