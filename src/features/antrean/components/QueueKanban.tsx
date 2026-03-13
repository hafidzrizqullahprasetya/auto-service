"use client";

import { useState } from "react";
import { Notify } from "@/utils/notify";
import { Antrean } from "@/types/antrean";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

const MECHANICS = ["Suryo Atmojo", "Budi Setiadi", "Agus Prasetyo", "Noko"];

const STATUS_COLUMNS: Antrean["status"][] = [
  "Menunggu",
  "Dikerjakan",
  "Menunggu Sparepart",
  "Selesai",
];

const STATUS_COLORS: Record<Antrean["status"], string> = {
  Menunggu: "text-red bg-red/10",
  Dikerjakan: "text-blue bg-blue/10",
  "Menunggu Sparepart": "text-yellow bg-yellow/10",
  Selesai: "text-green bg-green/10",
};

import { Skeleton } from "@/components/ui/skeleton";
import { QueueFormModal } from "./QueueFormModal";
import { SPKModal } from "./SPKModal";
import { ConfirmDeleteModal } from "@/features/shared";

interface KanbanCardProps {
  item: Antrean;
  onStatusChange: (id: string, status: Antrean["status"]) => void;
  onMechanicAssign: (id: string, mekanik: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onPrint: () => void;
  onPay: () => void;
}

function KanbanCard({
  item,
  onStatusChange,
  onMechanicAssign,
  onEdit,
  onDelete,
  onPrint,
  onPay,
}: KanbanCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMechanicMenu, setShowMechanicMenu] = useState(false);

  return (
    <div className="relative rounded-2xl border border-stroke bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-gray-dark">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-2 text-dark dark:bg-dark-2 dark:text-white transition-transform hover:scale-105">
            {item.tipe === "Mobil" ? (
              <Icons.KendaraanMobil size={18} />
            ) : (
              <Icons.KendaraanMotor size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-black uppercase text-dark dark:text-white">
              {item.noPolisi}
            </span>
            <span className="text-[10px] font-bold uppercase text-dark-5">
              {item.kendaraan}
            </span>
          </div>
        </div>

        <button
          className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 transition-colors dark:hover:bg-dark-3"
          onClick={() => {
            setShowMenu(!showMenu);
            setShowMechanicMenu(false);
          }}
        >
          <Icons.Settings size={14} />
        </button>

        {showMenu && (
          <div className="absolute right-4 top-12 z-20 min-w-[170px] rounded-xl border border-stroke bg-white p-1.5 shadow-2xl animate-in fade-in zoom-in duration-200 dark:border-dark-3 dark:bg-dark-2">
            <div className="mb-1 border-b border-stroke pb-1 dark:border-dark-3">
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-dark transition-colors hover:bg-gray-2 dark:text-white"
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
              >
                <Icons.Edit size={12} className="text-dark-5" />
                Ubah Detail
              </button>
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-dark transition-colors hover:bg-gray-2 dark:text-white"
                onClick={() => {
                  onPrint();
                  setShowMenu(false);
                }}
              >
                <Icons.Print size={12} className="text-dark-5" />
                Cetak SPK
              </button>
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-red transition-colors hover:bg-red/10 animate-pulse"
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
              >
                <Icons.Delete size={12} />
                Hapus Antrean
              </button>
              <button
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-secondary transition-colors hover:bg-secondary/10"
                onClick={() => {
                  onPay();
                  setShowMenu(false);
                }}
              >
                <Icons.Kasir size={12} />
                Lanjut ke Kasir
              </button>
            </div>

            <p className="mt-1 px-3 py-1 text-[11px] font-black uppercase text-dark-5 tracking-tighter/40">
              Pindah Status
            </p>
            {STATUS_COLUMNS.filter((s) => s !== item.status).map((s) => (
              <button
                key={s}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-dark transition-colors hover:bg-gray-2 dark:text-white",
                )}
                onClick={() => {
                  onStatusChange(item.id, s);
                  setShowMenu(false);
                }}
              >
                <span
                  className={cn("h-2 w-2 rounded-full", STATUS_COLORS[s])}
                />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2 border-y border-stroke py-3 dark:border-dark-3">
        <div className="flex items-center gap-2 text-[11px] font-black text-dark dark:text-white">
          <Icons.Pelanggan size={12} className="text-dark-5" />
          <span className="truncate">{item.pelanggan}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-dark-5">
          <Icons.Repair size={12} className="shrink-0" />
          <span className="truncate">{item.layanan}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-black text-secondary tabular-nums">
          <Icons.History size={12} />
          <span>{dayjs(item.waktuMasuk).format("HH:mm")}</span>
        </div>
        {item.menginap && (
          <span className="bg-red/20 inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-red">
            Menginap
          </span>
        )}
      </div>

      <div className="relative mt-3">
        <button
          onClick={() => {
            setShowMechanicMenu(!showMechanicMenu);
            setShowMenu(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all active:scale-95",
            item.mekanik
              ? "bg-secondary text-white shadow-lg shadow-secondary/20"
              : "border border-dashed border-stroke text-dark-5 hover:border-dark hover:text-dark dark:border-dark-3",
          )}
        >
          <Icons.Karyawan size={12} />
          {item.mekanik ?? "Tugaskan Mekanik..."}
        </button>

        {showMechanicMenu && (
          <div className="absolute bottom-full left-0 z-20 mb-1.5 w-full rounded-xl border border-stroke bg-white p-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 dark:border-dark-2 dark:bg-dark-2">
            {MECHANICS.map((m) => (
              <button
                key={m}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-gray-2 dark:text-white",
                  item.mekanik === m
                    ? "font-black text-secondary"
                    : "font-bold",
                )}
                onClick={() => {
                  onMechanicAssign(item.id, m);
                  setShowMechanicMenu(false);
                }}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  items: Antrean[];
  onStatusChange: (id: string, status: Antrean["status"]) => void;
  onMechanicAssign: (id: string, mekanik: string) => void;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onPay: (item: Antrean) => void;
  isLoading?: boolean;
}

export function QueueKanban({
  items,
  onStatusChange,
  onMechanicAssign,
  onUpdate,
  onDelete,
  onPay,
  isLoading = false,
}: KanbanBoardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Antrean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (item: Antrean) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: Antrean) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handlePrint = (item: Antrean) => {
    setSelectedItem(item);
    setShowPrintModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_COLUMNS.map((status) => {
          const colItems = items.filter((i) => i.status === status);
          return (
            <div key={status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-stroke pb-3 dark:border-dark-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-3 w-3 rounded-full shadow-sm",
                      STATUS_COLORS[status],
                    )}
                  />
                  <h3 className="text-sm font-black uppercase tracking-tight text-dark dark:text-white">
                    {status}
                  </h3>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gray-2 text-[10px] font-black text-dark dark:bg-dark-2 dark:text-white">
                  {colItems.length}
                </span>
              </div>

              <div className="flex min-h-[500px] flex-col gap-4 py-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark">
                      <div className="flex gap-3 mb-4">
                        <Skeleton className="h-10 w-10 rounded-xl" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                      <div className="space-y-2 border-y border-stroke py-3 dark:border-dark-3">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <Skeleton className="h-8 w-full mt-3 rounded-xl" />
                    </div>
                  ))
                ) : (
                  <>
                    {colItems.map((item) => (
                      <KanbanCard
                        key={item.id}
                        item={item}
                        onStatusChange={onStatusChange}
                        onMechanicAssign={onMechanicAssign}
                        onEdit={() => handleEdit(item)}
                        onDelete={() => handleDelete(item)}
                        onPrint={() => handlePrint(item)}
                        onPay={async () => {
                          Notify.loading("Menyiapkan Kasir...");
                          onPay(item);
                        }}
                      />
                    ))}
                    {colItems.length === 0 && (
                      <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-stroke opacity-30 dark:border-dark-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-dark-5">
                          KOSONG
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showEditModal && (
        <QueueFormModal
          item={selectedItem}
          isLoading={isSaving}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSave={async (data) => {
            if (!selectedItem) return;
            setIsSaving(true);
            try {
              await onUpdate(selectedItem.id, data);
              setShowEditModal(false);
              setSelectedItem(null);
            } finally {
              setIsSaving(false);
            }
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          title="Hapus Antrean"
          description="Anda akan menghapus data kendaraan ini dari papan antrean."
          itemDisplay={selectedItem?.noPolisi}
          isLoading={isDeleting}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={async () => {
            if (!selectedItem) return;
            setIsDeleting(true);
            try {
              await onDelete(selectedItem.id);
              setShowDeleteModal(false);
              setSelectedItem(null);
            } finally {
              setIsDeleting(false);
            }
          }}
        />
      )}

      {showPrintModal && selectedItem && (
        <SPKModal
          item={selectedItem}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}

export { QueueKanban as KanbanBoard };
