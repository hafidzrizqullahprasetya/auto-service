"use client";

import { useState } from "react";
import { Antrean } from "@/mock/antrean";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

const MECHANICS = ["Suryo Atmojo", "Budi Setiadi", "Agus Prasetyo"];

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

import { AntreanFormModal } from "./AntreanFormModal";
import { SPKModal } from "./SPKModal";
import { ConfirmDeleteModal } from "@/features/shared";

interface KanbanCardProps {
  item: Antrean;
  onStatusChange: (id: string, status: Antrean["status"]) => void;
  onMechanicAssign: (id: string, mekanik: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onPrint: () => void;
}

function KanbanCard({
  item,
  onStatusChange,
  onMechanicAssign,
  onEdit,
  onDelete,
  onPrint,
}: KanbanCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMechanicMenu, setShowMechanicMenu] = useState(false);

  return (
    <div className="relative rounded-xl border border-stroke bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-dark-3 dark:bg-gray-dark">
      {/* Header card */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-2 text-dark dark:bg-dark-2 dark:text-white">
            {item.tipe === "Mobil" ? (
              <Icons.KendaraanMobil size={18} />
            ) : (
              <Icons.KendaraanMotor size={18} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-dark dark:text-white">
              {item.noPolisi}
            </span>
            <span className="text-[10px] font-medium text-dark-5">
              {item.kendaraan}
            </span>
          </div>
        </div>

        <button
          className="rounded-lg p-1 text-dark-5 hover:bg-gray-2"
          onClick={() => {
            setShowMenu(!showMenu);
            setShowMechanicMenu(false);
          }}
        >
          <Icons.Settings size={14} />
        </button>

        {showMenu && (
          <div className="absolute right-4 top-12 z-20 min-w-[170px] rounded-xl border border-stroke bg-white p-1.5 shadow-2xl dark:border-dark-3 dark:bg-dark-2">
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
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-red transition-colors hover:bg-red/10"
                onClick={() => {
                  onDelete();
                  setShowMenu(false);
                }}
              >
                <Icons.Delete size={12} />
                Hapus Antrean
              </button>
            </div>

            <p className="mt-1 px-3 py-1 text-[11px] font-bold text-dark-5">
              Pindah Status
            </p>
            {STATUS_COLUMNS.filter((s) => s !== item.status).map((s) => (
              <button
                key={s}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-dark transition-colors hover:bg-gray-2 dark:text-white"
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

      {/* Info Content */}
      <div className="space-y-2 border-y border-stroke py-3 dark:border-dark-3">
        <div className="flex items-center gap-2 text-[11px] font-bold text-dark dark:text-white">
          <Icons.Pelanggan size={12} className="text-dark-5" />
          <span>{item.pelanggan}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-dark-5">
          <Icons.Repair size={12} className="shrink-0" />
          <span className="truncate">{item.layanan}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-dark-5">
          <Icons.Pending size={12} />
          <span>{dayjs(item.waktuMasuk).format("HH:mm")}</span>
        </div>
        {item.menginap && (
          <span className="bg-danger/20 inline-flex items-center gap-1 rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-dark">
            Menginap
          </span>
        )}
      </div>

      {/* Mechanic Assign */}
      <div className="relative mt-3">
        <button
          onClick={() => {
            setShowMechanicMenu(!showMechanicMenu);
            setShowMenu(false);
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all",
            item.mekanik
              ? "bg-secondary text-white shadow-lg shadow-secondary/10"
              : "border border-dashed border-stroke text-dark-5 hover:border-dark hover:text-dark dark:border-dark-3",
          )}
        >
          <Icons.Karyawan size={12} />
          {item.mekanik ?? "Tugaskan Mekanik"}
        </button>

        {showMechanicMenu && (
          <div className="absolute bottom-full left-0 z-20 mb-1.5 w-full rounded-xl border border-stroke bg-white p-1.5 shadow-2xl dark:border-dark-3 dark:bg-dark-2">
            {MECHANICS.map((m) => (
              <button
                key={m}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-gray-2 dark:text-white",
                  item.mekanik === m
                    ? "font-bold text-secondary"
                    : "font-medium",
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
}

export function KanbanBoard({
  items,
  onStatusChange,
  onMechanicAssign,
}: KanbanBoardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Antrean | null>(null);

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
      <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_COLUMNS.map((status) => {
          const colItems = items.filter((i) => i.status === status);
          return (
            <div key={status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-stroke pb-3 dark:border-dark-3">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      STATUS_COLORS[status],
                    )}
                  />
                  <h3 className="text-sm font-bold text-dark dark:text-white">
                    {status}
                  </h3>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-gray-2 text-[10px] font-bold text-dark dark:bg-dark-2 dark:text-white">
                  {colItems.length}
                </span>
              </div>

              <div className="flex min-h-[500px] flex-col gap-4 py-2">
                {colItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onStatusChange={onStatusChange}
                    onMechanicAssign={onMechanicAssign}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                    onPrint={() => handlePrint(item)}
                  />
                ))}
                {colItems.length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-stroke dark:border-dark-3">
                    <p className="text-[10px] font-bold italic text-dark-5/40">
                      Kosong
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showEditModal && (
        <AntreanFormModal
          item={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSave={(data) => {
            console.log("Saving edited item from kanban:", data);
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          title="Hapus Antrean"
          description="Anda akan menghapus data kendaraan ini dari papan antrean."
          itemDisplay={selectedItem?.noPolisi}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={() => {
            console.log("Deleting item from kanban:", selectedItem?.id);
            setShowDeleteModal(false);
            setSelectedItem(null);
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
