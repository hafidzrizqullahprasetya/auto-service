"use client";

import { useState } from "react";
import { Antrean } from "@/mock/antrean";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
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

const STATUS_CONFIG = {
  Menunggu: {
    color: "bg-red-light-1 border-red/20",
    headerColor: "bg-red text-white",
    dotColor: "bg-red",
    icon: Icons.Pending,
  },
  Dikerjakan: {
    color: "bg-primary/5 border-primary/20",
    headerColor: "bg-primary text-white",
    dotColor: "bg-primary",
    icon: Icons.Repair,
  },
  "Menunggu Sparepart": {
    color: "bg-yellow-light-1 border-yellow/20",
    headerColor: "bg-yellow text-dark",
    dotColor: "bg-yellow",
    icon: Icons.Inventory,
  },
  Selesai: {
    color: "bg-green-light-1 border-green/20",
    headerColor: "bg-green text-white",
    dotColor: "bg-green",
    icon: Icons.Success,
  },
};

interface KanbanCardProps {
  item: Antrean;
  onStatusChange: (id: string, status: Antrean["status"]) => void;
  onMechanicAssign: (id: string, mekanik: string) => void;
}

function KanbanCard({ item, onStatusChange, onMechanicAssign }: KanbanCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showMechanicMenu, setShowMechanicMenu] = useState(false);

  const nextStatusMap: Partial<Record<Antrean["status"], Antrean["status"]>> = {
    Menunggu: "Dikerjakan",
    Dikerjakan: "Selesai",
    "Menunggu Sparepart": "Dikerjakan",
  };
  const nextStatus = nextStatusMap[item.status];

  return (
    <div className="relative rounded-xl border border-stroke bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-dark-3 dark:bg-dark-2">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-2 text-dark dark:bg-dark-3 dark:text-white">
            {item.tipe === "Mobil" ? (
              <Icons.KendaraanMobil size={18} />
            ) : (
              <Icons.KendaraanMotor size={18} />
            )}
          </div>
          <div>
            <p className="font-black text-sm text-dark dark:text-white">
              {item.noPolisi}
            </p>
            <p className="text-[10px] text-dark-5 dark:text-dark-6">
              {item.kendaraan}
            </p>
          </div>
        </div>

        <button
          className="rounded-lg p-1.5 hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Icons.Settings size={14} className="text-dark-5" />
        </button>

        {showMenu && (
          <div className="absolute right-3 top-12 z-20 rounded-xl border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2 p-1 min-w-[160px]">
            {STATUS_COLUMNS.filter((s) => s !== item.status).map((s) => (
              <button
                key={s}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-2 dark:hover:bg-dark-3 transition-colors"
                onClick={() => {
                  onStatusChange(item.id, s);
                  setShowMenu(false);
                }}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    STATUS_CONFIG[s].dotColor
                  )}
                />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs">
          <Icons.Pelanggan size={12} className="text-dark-5 shrink-0" />
          <span className="font-medium text-dark dark:text-white">
            {item.pelanggan}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Icons.Repair size={12} className="text-dark-5 shrink-0" />
          <span className="text-dark-5 dark:text-dark-6 line-clamp-1">
            {item.layanan}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Icons.Pending size={12} className="text-dark-5 shrink-0" />
          <span className="text-dark-5 dark:text-dark-6">
            Masuk: {dayjs(item.waktuMasuk).format("HH:mm")}
          </span>
        </div>

        {/* Mekanik assignment */}
        <div className="relative mt-2">
          <button
            onClick={() => { setShowMechanicMenu(!showMechanicMenu); setShowMenu(false); }}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all",
              item.mekanik
                ? "bg-primary/10 text-primary font-semibold"
                : "border border-dashed border-stroke dark:border-dark-3 text-dark-5 hover:border-primary hover:text-primary"
            )}
          >
            <Icons.Karyawan size={11} />
            {item.mekanik ?? "Tugaskan Mekanik"}
          </button>
          {showMechanicMenu && (
            <div className="absolute left-0 top-full z-20 mt-1 w-full rounded-xl border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2 p-1">
              {MECHANICS.map((m) => (
                <button
                  key={m}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors",
                    item.mekanik === m && "font-bold text-primary"
                  )}
                  onClick={() => { onMechanicAssign(item.id, m); setShowMechanicMenu(false); }}
                >
                  <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                    {m.charAt(0)}
                  </span>
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Estimasi */}
        {item.estimasiSelesai && (
          <div className="flex items-center gap-1.5 text-xs">
            <Icons.Chart size={11} className="text-dark-5 shrink-0" />
            <span className="text-dark-5">Est. selesai: <strong className="text-dark dark:text-white">{item.estimasiSelesai}</strong></span>
          </div>
        )}
      </div>

      {/* Action */}
      {nextStatus && (
        <button
          onClick={() => onStatusChange(item.id, nextStatus)}
          className="mt-3 w-full rounded-lg bg-primary/10 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white"
        >
          → {nextStatus}
        </button>
      )}
    </div>
  );
}

interface KanbanBoardProps {
  items: Antrean[];
  onStatusChange: (id: string, status: Antrean["status"]) => void;
  onMechanicAssign: (id: string, mekanik: string) => void;
}

export function KanbanBoard({ items, onStatusChange, onMechanicAssign }: KanbanBoardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATUS_COLUMNS.map((status) => {
        const config = STATUS_CONFIG[status];
        const colItems = items.filter((i) => i.status === status);
        const StatusIcon = config.icon;

        return (
          <div key={status} className="flex flex-col gap-3">
            {/* Column Header */}
            <div
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-2.5",
                config.headerColor
              )}
            >
              <div className="flex items-center gap-2">
                <StatusIcon size={16} />
                <span className="text-sm font-bold">{status}</span>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs font-black">
                {colItems.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 min-h-[200px]">
              {colItems.length > 0 ? (
                colItems.map((item) => (
                  <KanbanCard
                    key={item.id}
                    item={item}
                    onStatusChange={onStatusChange}
                    onMechanicAssign={onMechanicAssign}
                  />
                ))
              ) : (
                <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-stroke dark:border-dark-3">
                  <p className="text-xs text-dark-5">Kosong</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
