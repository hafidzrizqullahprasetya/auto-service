"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  AntreanTable,
  KanbanBoard,
  AntreanFormModal,
} from "@/features/antrean";
import { Antrean } from "@/mock/antrean";
import { useAntrean } from "@/hooks/useAntrean";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Notify } from "@/utils/notify";

type ViewType = "kanban" | "table";

export default function AntreanPage() {
  const [activeView, setActiveView] = useState<ViewType>("table");
  const [showModal, setShowModal] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: items,
    loading,
    error,
    updateStatus,
    assignMechanic,
    create,
    remove,
    refetch,
  } = useAntrean();

  const handleCreate = async (data: any) => {
    setIsSaving(true);
    Notify.loading("Sedang membuat antrean...");
    try {
      await create(data);
      Notify.toast("Antrean baru berhasil dibuat!");
      setShowModal(false);
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal membuat antrean");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    setIsSaving(true);
    Notify.loading("Memperbarui data antrean...");
    try {
      const { antreanService } = await import("@/services/antrean.service");
      await antreanService.update(id, data);
      await refetch();
      Notify.toast("Data antrean berhasil diperbarui!");
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal memperbarui antrean");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    Notify.loading("Menghapus antrean...");
    try {
      await remove(id);
      Notify.toast("Antrean berhasil dihapus!");
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal menghapus antrean");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: Antrean["status"],
  ) => {
    Notify.loading(`Mengubah status ke ${newStatus}...`);
    try {
      await updateStatus(id, newStatus);
      Notify.toast(`Status berhasil diubah ke ${newStatus}`);
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal mengubah status");
    }
  };

  const handleMechanicAssign = async (id: string, mekanik: string) => {
    Notify.loading(`Menugaskan ${mekanik}...`);
    try {
      await assignMechanic(id, mekanik);
      Notify.toast(`${mekanik} berhasil ditugaskan`);
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal menugaskan mekanik");
    }
  };

  const TABS = [
    { id: "kanban" as ViewType, label: "Kanban Board", icon: LayoutGrid },
    { id: "table" as ViewType, label: "Tabel Antrean", icon: LayoutList },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Manajemen Antrean" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          ⚠ {error}{" "}
          <button onClick={refetch} className="underline">
            Coba Lagi
          </button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark"
              >
                <Skeleton className="h-11.5 w-11.5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))
          : [
              {
                label: "Menunggu",
                count: items.filter((i) => i.status === "Menunggu").length,
                icon: Icons.Pending,
              },
              {
                label: "Dikerjakan",
                count: items.filter((i) => i.status === "Dikerjakan").length,
                icon: Icons.Repair,
              },
              {
                label: "Sparepart",
                count: items.filter((i) => i.status === "Menunggu Sparepart")
                  .length,
                icon: Icons.Inventory,
              },
              {
                label: "Selesai",
                count: items.filter((i) => i.status === "Selesai").length,
                icon: Icons.Success,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark lg:gap-6"
              >
                <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-2 dark:text-blue-400">
                  <s.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none tracking-tight text-dark dark:text-white">
                    {s.count}
                  </p>
                  <p className="mt-1 text-sm font-medium text-dark-5">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-fit gap-1 rounded-xl border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-gray-dark">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
                activeView === id
                  ? "bg-secondary text-white"
                  : "text-dark-5 hover:text-dark dark:hover:text-white",
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-secondary px-6 text-sm font-bold text-white shadow-lg shadow-secondary/10 hover:bg-opacity-90"
        >
          <Plus size={18} />
          Entry Antrean Baru
        </button>
      </div>

      {activeView === "kanban" ? (
        <div className="rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
          <KanbanBoard
            items={items}
            isLoading={loading}
            onStatusChange={handleStatusChange}
            onMechanicAssign={handleMechanicAssign}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <AntreanTable
          data={items}
          isLoading={loading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      {showModal && (
        <AntreanFormModal
          onClose={() => setShowModal(false)}
          isLoading={isSaving}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}
