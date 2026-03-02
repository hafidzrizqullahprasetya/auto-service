"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_REMINDERS, ServiceReminder } from "@/mock/service-history";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/components/Bengkel/shared";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

const STATUS_VARIANT: Record<ServiceReminder["status"], "success" | "info" | "danger"> = {
  Aktif: "success",
  Terkirim: "info",
  "Lewat Jatuh Tempo": "danger",
};

const JENIS_ICON: Record<ServiceReminder["jenisReminder"], React.ElementType> = {
  "Ganti Oli": Icons.Oil,
  "Service Rutin": Icons.Repair,
  "Cek Rem": Icons.Warning,
  "Tune Up": Icons.Database,
  "Perpanjang STNK": Icons.Card,
};

// ─── Summary mini-cards (tetap di atas tabel) ──────────────────────────────────
function ReminderSummary() {
  const lewat = MOCK_REMINDERS.filter((r) => r.status === "Lewat Jatuh Tempo").length;
  const aktif = MOCK_REMINDERS.filter((r) => r.status === "Aktif").length;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      {[
        { label: "Total Reminder", value: MOCK_REMINDERS.length, icon: Icons.Notification },
        { label: "Aktif", value: aktif, icon: Icons.Success },
        { label: "Lewat Tempo", value: lewat, icon: Icons.Alert, isAlert: true },
      ].map(({ label, value, icon: Icon, isAlert }) => (
        <div key={label} className="rounded-lg border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3 shadow-none">
          <div className={cn(
            "h-11 w-11 shrink-0 rounded-lg flex items-center justify-center border border-stroke dark:border-dark-4 bg-gray-2 dark:bg-dark-3",
            isAlert ? "text-red" : "text-dark dark:text-white"
          )}>
            <Icon size={20} />
          </div>
          <div>
            <p className={cn("font-bold text-2xl leading-none tracking-tight", isAlert ? "text-red" : "text-dark dark:text-white")}>{value}</p>
            <p className="text-sm font-medium text-dark-5 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReminderTable() {
  const columns = useMemo<ColumnDef<ServiceReminder>[]>(
    () => [
      {
        accessorKey: "pelanggan",
        header: "Pelanggan / Kendaraan",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <p className="font-bold text-dark dark:text-white leading-tight">{r.pelanggan}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-secondary text-xs uppercase">{r.noPolisi}</span>
                <span className="text-[11px] font-medium text-dark-5">{r.kendaraan}</span>
              </div>
              <p className="text-xs font-medium text-dark-5 leading-none mt-1">{r.phone}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "jenisReminder",
        header: "Perihal Reminder",
        cell: ({ row }) => {
          const r = row.original;
          const JenisIcon = JENIS_ICON[r.jenisReminder];
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3 text-dark-5 border border-stroke dark:border-dark-4">
                <JenisIcon size={16} />
              </div>
              <div>
                <p className="font-bold text-dark dark:text-white text-sm leading-none mb-1">{r.jenisReminder}</p>
                {r.catatan && <p className="text-[11px] font-medium text-dark-5 leading-tight">{r.catatan}</p>}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "jadwalTanggal",
        header: () => <div className="w-full text-center">Jadwal Tempo</div>,
        cell: ({ row }) => {
          const r = row.original;
          const isOverdue = r.status === "Lewat Jatuh Tempo";
          return (
            <div className="flex w-full flex-col items-center justify-center">
              <p className={cn("font-bold text-sm tracking-tight", isOverdue ? "text-red" : "text-dark dark:text-white")}>
                {dayjs(r.jadwalTanggal).format("DD MMM YYYY")}
              </p>
              {isOverdue && (
                <p className="text-xs font-medium text-red mt-0.5">
                  Lewat {dayjs().diff(r.jadwalTanggal, "day")} hari
                </p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "odometerTarget",
        header: () => <div className="w-full text-center">Estimasi KM</div>,
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex w-full flex-col items-center justify-center tabular-nums">
              {r.odometerTarget ? (
                <p className="font-bold text-sm text-dark dark:text-white leading-none">
                  {r.odometerTarget.toLocaleString("id-ID")} <span className="text-[11px] font-medium text-dark-5">KM</span>
                </p>
              ) : (
                <p className="text-dark-5 text-[11px] font-medium">—</p>
              )}
              <p className="text-[11px] font-medium text-dark-5 mt-1">
                Last: {r.odometerSaat.toLocaleString("id-ID")} km
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => <div className="w-full text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge variant={STATUS_VARIANT[row.original.status]}>
              {row.original.status}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: () => (
          <div className="flex w-full items-center justify-center gap-2">
            <ActionButton 
              icon={<Icons.Whatsapp size={16} />} 
              variant="success" 
              title="Follow Up (Kirim WA)" 
            />
            <ActionButton 
              icon={<Icons.Delete size={16} />} 
              variant="delete"
              title="Batalkan Reminder"
            />
          </div>
        )
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <ReminderSummary />
      <DataTable
        columns={columns}
        data={MOCK_REMINDERS}
        searchable={["pelanggan", "noPolisi", "jenisReminder"]}
        searchPlaceholder="Cari pelanggan atau plat nomor..."
        title="Reminder & Follow-up Servis"
        description="Jadwal pengingat otomatis untuk pelanggan setia"
        pageSize={5}
        primaryAction={{
          label: "Tambah Reminder",
          onClick: () => {},
        }}
      />
    </div>
  );
}
