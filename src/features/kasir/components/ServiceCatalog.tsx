"use client";

import { useState } from "react";
import { useServiceCatalog } from "@/hooks/useServiceCatalog";
import { formatNumber } from "@/utils/format-number";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import { ServiceCatalogModal } from "./ServiceCatalogModal";
import { Notify } from "@/utils/notify";
import { serviceCatalogService } from "@/services/service-catalog.service";

const KATEGORI_COLORS: Record<string, string> = {
  "Mesin": "bg-primary/10 text-primary",
  "Rem & Transmisi": "bg-red-light-1 text-red",
  "Kelistrikan": "bg-yellow/10 text-yellow",
  "AC & Kabin": "bg-blue-light-1 text-primary",
  "Body & Cat": "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
  "Lainnya": "bg-gray-2 dark:bg-dark-3 text-dark-5",
};

export function ServiceCatalog() {
  const { data: items, loading, toggleAktif, refetch } = useServiceCatalog();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const filtered = items.filter(
    (s) =>
      s.namaJasa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await serviceCatalogService.update(editingItem.id, data);
        Notify.toast("Jasa berhasil diperbarui");
      } else {
        await serviceCatalogService.create(data);
        Notify.toast("Jasa baru berhasil ditambahkan");
      }
      refetch();
    } catch (error) {
      Notify.alert("Gagal", "Terjadi kesalahan saat menyimpan jasa", "error");
      throw error;
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-white shadow-sm dark:border-dark-3 dark:bg-gray-dark">
      <div className="flex flex-col gap-4 border-b border-stroke px-6 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-dark dark:text-white">Katalog Layanan & Harga Jasa</h3>
          <p className="mt-0.5 text-xs text-dark-5">Standar harga jasa yang ditampilkan di invoice</p>
        </div>
          <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-stroke bg-gray-1 pl-8 pr-4 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 w-48"
            />
            <Icons.Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-5" />
          </div>
          <button 
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-all active:scale-95"
          >
            <Icons.Plus size={16} />
            Tambah Jasa
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-dark-2"
              >
                <div className="mb-3 flex items-start justify-between">
                  <Skeleton width={80} height={20} className="rounded-full" />
                  <Skeleton width={36} height={20} className="rounded-full" />
                </div>
                <Skeleton width="80%" height={20} className="mb-2" />
                <div className="mb-3 space-y-1">
                  <Skeleton width="40%" height={14} />
                  <Skeleton width="50%" height={14} />
                  <Skeleton width="30%" height={14} />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton width={100} height={24} />
                  <Skeleton width={28} height={28} className="rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((svc) => (
              <div
                key={svc.id}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  svc.aktif
                    ? "border-stroke bg-white dark:border-dark-3 dark:bg-dark-2"
                    : "border-stroke/50 bg-gray-1 opacity-60 dark:border-dark-3/50 dark:bg-dark-3"
                )}
              >
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      KATEGORI_COLORS[svc.kategori] || "bg-gray-2 text-dark-5"
                    )}
                  >
                    {svc.kategori}
                  </span>
                  <button
                    onClick={() => toggleAktif(svc.id, svc.aktif)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors shrink-0",
                      svc.aktif ? "bg-primary" : "bg-gray-3 dark:bg-dark-3"
                    )}
                    title={svc.aktif ? "Nonaktifkan" : "Aktifkan"}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                        svc.aktif ? "left-4" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                <h4 className="mb-1 font-bold text-sm text-dark dark:text-white">{svc.namaJasa}</h4>

                <div className="mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-dark-5">
                    <Icons.Pending size={11} className="shrink-0" />
                    {svc.durasiEstimasi}
                  </div>
                  {svc.garansi && (
                    <div className="flex items-center gap-1.5 text-xs text-dark-5">
                      <Icons.Success size={11} className="shrink-0 text-green" />
                      Garansi {svc.garansi}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-dark-5">
                    {svc.berlakuUntuk === "Mobil" ? (
                      <Icons.KendaraanMobil size={11} className="shrink-0" />
                    ) : svc.berlakuUntuk === "Motor" ? (
                      <Icons.KendaraanMotor size={11} className="shrink-0" />
                    ) : (
                      <Icons.Antrean size={11} className="shrink-0" />
                    )}
                    {svc.berlakuUntuk}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-black text-base text-secondary">
                    Rp {formatNumber(svc.hargaStandar)}
                  </p>
                  <button 
                    onClick={() => {
                      setEditingItem(svc);
                      setShowModal(true);
                    }}
                    className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
                  >
                    <Icons.Settings size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-dark-5">
            <Icons.Search size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Tidak ada layanan ditemukan</p>
          </div>
        )}
      </div>

      {showModal && (
        <ServiceCatalogModal
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </div>
  );
}
