"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { KatalogJasa } from "./KatalogJasa";

type Tab = "bengkel" | "operasional" | "invoice" | "katalog";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "bengkel", label: "Profil Bengkel", icon: Icons.Dashboard },
  { id: "operasional", label: "Operasional", icon: Icons.Repair },
  { id: "invoice", label: "Pengaturan Invoice", icon: Icons.Print },
  { id: "katalog", label: "Katalog Jasa", icon: Icons.Kasir },
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
      <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
        {label}
      </label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-xl border border-stroke bg-gray-1 px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
      <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
        {label}
      </label>
      <select className="w-full rounded-xl border border-stroke bg-gray-1 px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white">
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
    <div className="flex items-center justify-between py-3 border-b border-stroke dark:border-dark-3 last:border-0">
      <div>
        <p className="text-sm font-semibold text-dark dark:text-white">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-dark-5">{description}</p>
        )}
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-gray-3 dark:bg-dark-3"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            checked ? "left-6" : "left-1"
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
    <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-6 py-4 dark:border-dark-3">
        <h3 className="font-bold text-dark dark:text-white">{title}</h3>
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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 border-2 border-dashed border-primary/30">
            <Icons.Dashboard size={30} className="text-primary/50" />
          </div>
          <div>
            <p className="font-semibold text-dark dark:text-white text-sm">Logo Bengkel</p>
            <p className="text-xs text-dark-5 mt-0.5">PNG, JPG maksimal 2MB. Ukuran rekomendasi 500×500px</p>
            <button className="mt-2 rounded-lg border border-stroke px-4 py-1.5 text-xs font-semibold text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 transition-colors">
              Unggah Logo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Nama Bengkel" defaultValue="AutoService Premium Garage" />
          <InputField label="Nomor Telepon / WA" defaultValue="+62 812-3456-7890" />
          <InputField label="Email" type="email" defaultValue="info@autoservice.id" />
          <InputField label="Website" defaultValue="www.autoservice.id" />
        </div>
        <div className="mt-4">
          <label className="mb-2 block text-sm font-semibold text-dark dark:text-white">
            Alamat Lengkap
          </label>
          <textarea
            rows={3}
            defaultValue="Jl. Otomotif No. 123, Kawasan Industri Otomotif, Jakarta Selatan, DKI Jakarta 12345."
            className="w-full rounded-xl border border-stroke bg-gray-1 px-4 py-2.5 text-sm text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white resize-none"
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

function OperasionalTab() {
  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Jam Operasional">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Jam Buka" type="time" defaultValue="08:00" />
          <InputField label="Jam Tutup" type="time" defaultValue="17:00" />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-dark dark:text-white">Hari Operasional</p>
          <div className="flex flex-wrap gap-2">
            {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => {
              const active = i < 6; // default Mon–Sat
              return (
                <button
                  key={d}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-bold transition-all",
                    active
                      ? "bg-primary text-white"
                      : "border border-stroke text-dark-5 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-2"
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
      <SectionCard title="Preview Invoice">
        <div className="rounded-xl border-2 border-dashed border-stroke dark:border-dark-3 p-8 text-center text-dark-5">
          <Icons.Print size={40} className="mx-auto mb-2 opacity-20" />
          <p className="text-sm">Preview invoice akan muncul di sini</p>
          <button className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 transition-all">
            Lihat Preview
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
      <div className="flex gap-1 rounded-xl border border-stroke bg-white p-1 shadow-sm dark:border-dark-3 dark:bg-gray-dark w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
              activeTab === id
                ? "bg-primary text-white shadow-sm"
                : "text-dark-5 hover:text-dark dark:hover:text-white"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "bengkel" && <ProfilTab />}
      {activeTab === "operasional" && <OperasionalTab />}
      {activeTab === "invoice" && <InvoiceTab />}
      {activeTab === "katalog" && <KatalogJasa />}

      {/* Save Button — only for form tabs */}
      {activeTab !== "katalog" && (
        <div className="flex justify-end gap-3">
          <button className="rounded-xl border border-stroke px-6 py-2.5 text-sm font-semibold text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-2 transition-all">
            Reset
          </button>
          <button className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white hover:bg-opacity-90 transition-all active:scale-95 shadow-sm">
            Simpan Perubahan
          </button>
        </div>
      )}
    </div>
  );
}
