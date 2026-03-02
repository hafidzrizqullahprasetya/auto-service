"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { KatalogJasa } from "@/components/Bengkel/Kasir/KatalogJasa";

import { MOCK_WA_NOTIFICATIONS } from "@/mock/wa-notifications";
import { Badge } from "@/components/Bengkel/shared";
import dayjs from "dayjs";

type Tab = "bengkel" | "operasional" | "invoice" | "katalog" | "wa";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "bengkel", label: "Profil Bengkel", icon: Icons.Dashboard },
  { id: "operasional", label: "Operasional", icon: Icons.Repair },
  { id: "invoice", label: "Pengaturan Invoice", icon: Icons.Print },
  { id: "katalog", label: "Katalog Jasa", icon: Icons.Kasir },
  { id: "wa", label: "WA Gateway", icon: Icons.Notification },
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
      <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">
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
      <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">
        {label}
      </label>
      <select className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white">
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
    <div className="flex items-center justify-between py-4 border-b border-stroke dark:border-dark-3 last:border-0">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-dark dark:text-white">{label}</p>
        {description && (
          <p className="mt-1 text-[10px] font-bold text-dark-5 uppercase tracking-tight">{description}</p>
        )}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative h-6 w-12 rounded-lg border-2 border-stroke bg-gray-1 dark:bg-dark-2",
          checked ? "bg-dark border-dark dark:bg-white dark:border-white" : "bg-gray-2 dark:bg-dark-3"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-5 rounded-md shadow-none",
            checked ? "right-0.5 bg-white dark:bg-dark" : "left-0.5 bg-dark dark:bg-white"
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
        <h3 className="text-sm font-black uppercase tracking-widest text-dark dark:text-white">{title}</h3>
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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3 border-2 border-dashed border-stroke dark:border-dark-4">
            <Icons.Dashboard size={30} className="text-dark-5" />
          </div>
          <div>
            <p className="font-black text-dark dark:text-white text-xs uppercase tracking-wider">Logo Bengkel</p>
            <p className="text-[10px] font-bold text-dark-5 mt-1 uppercase">PNG, JPG MAKS 2MB · 500×500PX</p>
            <button className="mt-3 rounded-lg border-2 border-dark px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white bg-dark hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white transition-all">
              GANTI LOGO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Nama Bengkel" defaultValue="AutoService Premium Garage" />
          <InputField label="Nomor Telepon / WA" defaultValue="+62 812-3456-7890" />
          <InputField label="Email Address" type="email" defaultValue="info@autoservice.id" />
          <InputField label="Website Office" defaultValue="www.autoservice.id" />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">
            Alamat Operasional
          </label>
          <textarea
            rows={3}
            defaultValue="Jl. Otomotif No. 123, Kawasan Industri Otomotif, Jakarta Selatan, DKI Jakarta 12345."
            className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="NPWP" defaultValue="12.345.678.9-012.000" />
          <InputField label="Nomor Izin Usaha (SIUP)" defaultValue="503/1234/SIUP/2023" />
        </div>
      </SectionCard>

      <SectionCard title="Media Sosial">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Instagram" placeholder="@autoservice.id" />
          <InputField label="Facebook" placeholder="fb.com/autoservice" />
          <InputField label="WhatsApp Business" defaultValue="+62 812-3456-7890" />
          <InputField label="Google Maps Link" placeholder="https://goo.gl/maps/..." />
        </div>
      </SectionCard>
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
          <p>WA Gateway digunakan untuk mengirim notifikasi otomatis ke pemilik bengkel saat stok sparepart mencapai batas minimum. Gunakan layanan seperti <strong>Fonnte</strong> atau <strong>WA Business API</strong>.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">Provider Gateway</label>
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
            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">Nomor WA Penerima</label>
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
          <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">API Secret Key</label>
          <input
            type="password"
            value={waToken}
            onChange={(e) => setWaToken(e.target.value)}
            placeholder="Key dari provider..."
            className="w-full rounded-lg border border-stroke bg-gray-1 px-4 py-2.5 text-sm font-black text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white font-mono tracking-widest"
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button className="rounded-lg bg-dark px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-dark border-2 border-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white transition-all">SIMPAN & TEST GATEWAY</button>
          <button className="rounded-lg border-2 border-stroke px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 transition-all">RESET OPTION</button>
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
                <p className="text-sm font-bold text-dark dark:text-white">{notif.sparePartName}</p>
                <p className="font-mono text-[10px] text-dark-5">{notif.sku}</p>
                <p className="mt-1 text-xs text-dark-5">
                  Stok: <span className="font-bold text-secondary">{notif.currentStock}</span> / Min: {notif.minimumStock}
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
                  {notif.status === "sent" ? "Terkirim" : notif.status === "pending" ? "Menunggu" : "Gagal"}
                </Badge>
                <p className="text-[10px] text-dark-5">
                  {notif.sentAt ? dayjs(notif.sentAt).format("DD/MM/YY HH:mm") : "—"}
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
          <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-dark dark:text-white">Hari Operasional</p>
          <div className="flex flex-wrap gap-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => {
              const active = i < 6; // default Mon–Sat
              return (
                <button
                  key={d}
                  className={cn(
                    "rounded-lg px-5 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all",
                    active
                      ? "bg-dark text-white border-dark dark:bg-white dark:text-dark dark:border-white"
                      : "border-stroke text-dark-5 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-2"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <InputField label="Tarif PPN (%)" type="number" defaultValue="11" />
          <SelectField label="Mata Uang">
            <option value="IDR">IDR – Rupiah (Rp)</option>
            <option value="USD">USD – Dollar ($)</option>
          </SelectField>
          <InputField label="Kapasitas Bay Servis" type="number" defaultValue="6" />
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
          <InputField label="Catatan Footer Invoice" defaultValue="Terima kasih telah mempercayakan kendaraan Anda kepada kami." />
          <InputField label="Syarat & Ketentuan Garansi" defaultValue="Garansi berlaku 3 bulan sejak tanggal servis." />
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
        <div className="rounded-lg border-2 border-dashed border-stroke dark:border-dark-3 p-10 text-center text-dark-5 bg-gray-1 dark:bg-dark-2">
          <Icons.Print size={40} className="mx-auto mb-4 opacity-10" />
          <p className="text-[11px] font-black uppercase tracking-widest">Live billing preview unavailable</p>
          <button className="mt-6 rounded-lg bg-dark border-2 border-dark px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white transition-all">
            GENERATE PREVIEW PDF
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

export function PengaturanBengkel() {
  const [activeTab, setActiveTab] = useState<Tab>("bengkel");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-1 dark:bg-dark-2 p-1 rounded-lg w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-none",
              activeTab === id
                ? "bg-dark text-white dark:bg-white dark:text-dark shadow-none"
                : "text-dark-5 hover:text-dark dark:hover:text-white"
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

      {/* Save Button — only for form tabs */}
      {activeTab !== "katalog" && activeTab !== "wa" && (
        <div className="flex justify-end gap-3 mt-4">
          <button className="rounded-lg border-2 border-stroke px-6 py-3 text-[11px] font-black uppercase tracking-widest text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 transition-all">
            RESET DEFAULT
          </button>
          <button className="rounded-lg bg-dark border-2 border-dark px-10 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white transition-all active:scale-100 shadow-none">
            COMMIT CHANGES
          </button>
        </div>
      )}
    </div>
  );
}
