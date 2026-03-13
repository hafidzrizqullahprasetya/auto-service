"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import {
  AntreanTable,
  KanbanBoard,
  AntreanFormModal,
  QueueSummary,
  QueueSummarySkeleton,
  QueueTableSkeleton,
  QueueKanbanSkeleton,
} from "@/features/antrean";
import { Antrean } from "@/types/antrean";
import { useAntrean } from "@/hooks/useAntrean";
import { LayoutGrid, LayoutList, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { Notify } from "@/utils/notify";

type ViewType = "kanban" | "table";

export default function AntreanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const modalParam = searchParams.get("modal");

  const [activeView, setActiveView] = useState<ViewType>("table");
  const showModal = modalParam === "create";

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

  const setShowModal = (val: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("modal", "create");
    } else {
      params.delete("modal");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreate = async (data: any) => {
    setIsSaving(true);
    Notify.loading("Sedang membuat antrean...");
    try {
      await create(data);
      Notify.toast("Unit berhasil masuk antrean!", "success", "top");
      setShowModal(false);
      localStorage.removeItem("antrean_draft");
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
      Notify.toast("Data antrean berhasil diperbarui!", "success", "top");
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
      Notify.toast("Antrean berhasil dihapus!", "success", "top");
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
      Notify.toast(`Status berhasil diubah ke ${newStatus}`, "success", "top");
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal mengubah status");
    }
  };

  const handleMechanicAssign = async (id: string, mekanik: string) => {
    Notify.loading(`Menugaskan ${mekanik}...`);
    try {
      await assignMechanic(id, mekanik);
      Notify.toast(`${mekanik} berhasil ditugaskan`, "success", "top");
    } catch (err: any) {
      Notify.alert("Gagal!", err.message || "Gagal menugaskan mekanik");
    }
  };

  const TABS = [
    { id: "kanban" as ViewType, label: "Kanban Board", icon: LayoutGrid },
    { id: "table" as ViewType, label: "Tabel Antrean", icon: LayoutList },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Manajemen Antrean" />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          ⚠ {error}{" "}
          <button onClick={refetch} className="underline">
            Coba Lagi
          </button>
        </div>
      )}

      <div className="mb-8">
        {loading ? <QueueSummarySkeleton /> : <QueueSummary items={items} />}
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
        <>
          {loading ? (
            <div className="rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
              <QueueKanbanSkeleton />
            </div>
          ) : (
            <div className="rounded-xl border border-stroke bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
              <KanbanBoard
                items={items}
                onStatusChange={handleStatusChange}
                onMechanicAssign={handleMechanicAssign}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {loading ? (
            <QueueTableSkeleton />
          ) : (
            <AntreanTable
              data={items}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </>
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
