"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useServiceCatalog } from "@/hooks/useServiceCatalog";
import { formatNumber } from "@/utils/format-number";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { ServiceCatalogSkeleton } from "./ServiceCatalogSkeleton";
import { ServiceCatalogModal } from "./ServiceCatalogModal";
import { BundleManagement } from "./BundleManagement";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { data: items, loading, toggleAktif, deleteItem, refetch } = useServiceCatalog();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"jasa" | "bundling">("jasa");
  const [editingItem, setEditingItem] = useState<any>(null);

  const modalParam = searchParams.get("modal");
  const editId = searchParams.get("id");

  useEffect(() => {
    if (modalParam === "edit" && editId) {
      const item = items.find((i) => i.id === editId);
      if (item) setEditingItem(item);
    } else {
      setEditingItem(null);
    }
  }, [modalParam, editId, items]);

  const updateModalUrl = (modal: "add" | "edit" | null, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (modal) {
      params.set("modal", modal);
      if (id) params.set("id", id);
      else params.delete("id");
    } else {
      params.delete("modal");
      params.delete("id");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filtered = items.filter(
    (s) =>
      s.namaJasa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await serviceCatalogService.update(editingItem.id, data);
      } else {
        await serviceCatalogService.create(data);
      }
      refetch();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="rounded-xl border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-stroke px-6 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between bg-gray-50/50">
        <div>
          <h3 className="font-bold text-dark dark:text-white uppercase tracking-tight">Katalog Jasa & Paket</h3>
          <p className="mt-0.5 text-xs text-dark-5">Kelola daftar layanan mandiri atau paket bundling</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-stroke dark:bg-dark-2 dark:border-dark-3">
          <button
            onClick={() => setActiveTab("jasa")}
            className={cn(
              "px-4 py-1.5 text-xs font-black rounded-lg transition-all",
              activeTab === "jasa" 
                ? "bg-dark text-white shadow-md" 
                : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            )}
          >
            DAFTAR JASA
          </button>
          <button
            onClick={() => setActiveTab("bundling")}
            className={cn(
              "px-4 py-1.5 text-xs font-black rounded-lg transition-all",
              activeTab === "bundling" 
                ? "bg-dark text-white shadow-md" 
                : "text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
            )}
          >
            PAKET BUNDLING
          </button>
        </div>
      </div>

      {activeTab === "jasa" ? (
        <>
          <div className="flex flex-col gap-4 border-b border-stroke px-6 py-4 dark:border-dark-3 sm:flex-row sm:items-center sm:justify-between">
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
                onClick={() => updateModalUrl("add")}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-opacity-90 transition-all shadow-sm"
              >
                <Icons.Plus size={16} />
                Tambah Jasa
              </button>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <ServiceCatalogSkeleton />
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
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
                            svc.aktif ? "left-4" : "left-0.5"
                          )}
                        />
                      </button>
                    </div>

                    <h4 className="mb-0.5 font-bold text-sm text-dark dark:text-white leading-tight">{svc.namaJasa}</h4>
                    <p className="mb-1.5 text-[10px] font-mono font-bold text-dark-5 bg-gray-1 dark:bg-dark-3 px-1.5 py-0.5 rounded w-fit uppercase">
                      {svc.sku || "SRV-XXXX"}
                    </p>

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
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => updateModalUrl("edit", svc.id)}
                          className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
                        >
                          <Icons.Settings size={14} />
                        </button>
                        <button 
                          onClick={async () => {
                            const confirmed = await Notify.confirm(
                              "Hapus Jasa?",
                              `Apakah Anda yakin ingin menghapus "${svc.namaJasa}"? Tindakan ini tidak dapat dibatalkan.`,
                              "Ya, Hapus"
                            );
                            
                            if (confirmed) {
                              try {
                                Notify.loading("Menghapus jasa...");
                                await deleteItem(svc.id);
                                // Beri waktu sebentar agar loading terlihat
                                await new Promise(r => setTimeout(r, 800));
                                Notify.close();
                                Notify.toast("Jasa berhasil dihapus", "success");
                              } catch (error) {
                                Notify.close();
                                Notify.alert("Gagal", "Terjadi kesalahan saat menghapus jasa", "error");
                              }
                            }
                          }}
                          className="rounded-lg p-1.5 text-red hover:bg-red-light-1 transition-colors"
                        >
                          <Icons.Delete size={14} />
                        </button>
                      </div>
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
        </>
      ) : (
        <BundleManagement />
      )}

      {modalParam && activeTab === "jasa" && (
        <ServiceCatalogModal
          key={editingItem?.id || modalParam}
          onClose={() => updateModalUrl(null)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </div>
  );
}
