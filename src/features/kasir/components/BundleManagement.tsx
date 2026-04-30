"use client";

import { useState, useEffect } from "react";
import { serviceBundlesService, ApiServiceBundle } from "@/services/service-bundles.service";
import { formatNumber } from "@/utils/format-number";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { Notify } from "@/utils/notify";
import { ActionButton } from "@/features/shared";
import { BundleModal } from "./BundleModal";

export function BundleManagement() {
  const [bundles, setBundles] = useState<ApiServiceBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<ApiServiceBundle | null>(null);

  const fetchBundles = async () => {
    try {
      setLoading(true);
      const data = await serviceBundlesService.getAll();
      setBundles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleAdd = () => {
    setEditingBundle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bundle: ApiServiceBundle) => {
    setEditingBundle(bundle);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await Notify.confirm(
      "Hapus Paket?",
      "Apakah Anda yakin ingin menghapus paket servis ini?",
      "Ya, Hapus"
    );

    if (confirmed) {
      try {
        Notify.loading("Menghapus paket...");
        await serviceBundlesService.delete(id);
        Notify.close();
        Notify.toast("Paket berhasil dihapus", "success");
        fetchBundles();
      } catch (error) {
        Notify.close();
        Notify.alert("Gagal", "Terjadi kesalahan saat menghapus paket", "error");
      }
    }
  };

  const handleSave = async () => {
    setIsModalOpen(false);
    fetchBundles();
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-dark-5">Memuat daftar paket...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black text-dark dark:text-white">Daftar Paket Servis (Bundling)</h3>
          <p className="text-sm font-medium text-dark-5 italic">Paket pekerjaan sekaligus dengan harga hemat</p>
        </div>
        <ActionButton
          variant="primary"
          label="Buat Paket Baru"
          icon={<Icons.Plus size={18} />}
          onClick={handleAdd}
          className="w-fit"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bundles.length === 0 ? (
          <div className="col-span-full py-12 text-center text-dark-5 border-2 border-dashed border-stroke rounded-2xl dark:border-dark-3">
             <Icons.Inventory size={48} className="mx-auto mb-4 opacity-20" />
             <p className="font-bold">Belum ada paket servis.</p>
             <p className="text-xs">Klik tombol "Buat Paket Baru" untuk mulai.</p>
          </div>
        ) : (
          bundles.map((bundle) => (
            <div
              key={bundle.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-stroke bg-white transition-all hover:border-primary/40 hover:shadow-xl dark:border-dark-3 dark:bg-dark-2"
            >
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icons.Inventory size={24} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(bundle)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-1 text-dark-5 hover:bg-dark hover:text-white dark:bg-dark-3 transition-colors"
                    >
                      <Icons.Settings size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(bundle.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Icons.Delete size={14} />
                    </button>
                  </div>
                </div>

                <h4 className="mb-1 text-lg font-black text-dark dark:text-white line-clamp-1">{bundle.name}</h4>
                <p className="mb-4 text-xs font-medium text-dark-5 line-clamp-2 min-h-[32px]">
                  {bundle.description || "Tidak ada deskripsi paket."}
                </p>

                <div className="mb-6 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">Item Pekerjaan:</p>
                  <div className="flex flex-wrap gap-2">
                    {bundle.items.slice(0, 3).map((item) => (
                      <span
                        key={item.id}
                        className="rounded-md bg-gray-1 px-2 py-1 text-[10px] font-bold text-dark-5 dark:bg-dark-3"
                      >
                        {item.task_name}
                      </span>
                    ))}
                    {bundle.items.length > 3 && (
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                        + {bundle.items.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex items-end justify-between pt-4 border-t border-stroke dark:border-dark-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-dark-5">Total Paket</p>
                    <p className="text-xl font-black text-secondary">
                      Rp {formatNumber(Number(bundle.price))}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green">
                      <Icons.Success size={10} />
                      AKTIF
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <BundleModal
          bundle={editingBundle}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
