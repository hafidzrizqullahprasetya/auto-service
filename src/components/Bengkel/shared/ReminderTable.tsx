"use client";

import { useState } from "react";
import { MOCK_REMINDERS, ServiceReminder } from "@/mock/service-history";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { TableToolbar } from "@/components/Bengkel/shared";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ActionButton } from "@/components/Bengkel/shared";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

function ReminderStatusBadge({ status }: { status: ServiceReminder["status"] }) {
  const map = {
    "Aktif": "success" as const,
    "Terkirim": "info" as const,
    "Lewat Jatuh Tempo": "danger" as const,
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

const JENIS_ICON: Record<ServiceReminder["jenisReminder"], React.ElementType> = {
  "Ganti Oli": Icons.Oil,
  "Service Rutin": Icons.Repair,
  "Cek Rem": Icons.Warning,
  "Tune Up": Icons.Database,
  "Perpanjang STNK": Icons.Card,
};

export function ReminderTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = MOCK_REMINDERS.filter((r) =>
    r.pelanggan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.jenisReminder.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lewatJatuhTempo = filtered.filter((r) => r.status === "Lewat Jatuh Tempo").length;
  const aktif = filtered.filter((r) => r.status === "Aktif").length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Summary mini cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Icons.Notification size={20} />
          </div>
          <div>
            <p className="font-black text-xl text-dark dark:text-white">{MOCK_REMINDERS.length}</p>
            <p className="text-xs text-dark-5">Total Reminder</p>
          </div>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-green-light-1 text-green flex items-center justify-center">
            <Icons.Success size={20} />
          </div>
          <div>
            <p className="font-black text-xl text-dark dark:text-white">{aktif}</p>
            <p className="text-xs text-dark-5">Aktif</p>
          </div>
        </div>
        <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-red-light-1 text-red flex items-center justify-center">
            <Icons.Alert size={20} />
          </div>
          <div>
            <p className="font-black text-xl text-dark dark:text-white">{lewatJatuhTempo}</p>
            <p className="text-xs text-dark-5">Lewat Jatuh Tempo</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <TableToolbar
          title="Reminder & Follow-up Servis"
          description="Jadwal pengingat otomatis untuk pelanggan setia"
          onSearch={setSearchTerm}
          searchPlaceholder="Cari pelanggan atau plat nomor..."
          primaryAction={{
            label: "Tambah Reminder",
            onClick: () => {},
          }}
          filterActions={
            <ActionButton
              variant="outline"
              label="Kirim Semua"
              icon={<Icons.Notification size={16} />}
            />
          }
        />

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead className="font-bold text-left px-4">Pelanggan / Kendaraan</TableHead>
                <TableHead className="font-bold text-left px-4">Jenis Reminder</TableHead>
                <TableHead className="font-bold text-center px-4">Jadwal</TableHead>
                <TableHead className="font-bold text-center px-4">Odometer Target</TableHead>
                <TableHead className="font-bold text-center px-4">Status</TableHead>
                <TableHead className="font-bold text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const JenisIcon = JENIS_ICON[r.jenisReminder];
                const isOverdue = r.status === "Lewat Jatuh Tempo";
                return (
                  <TableRow
                    key={r.id}
                    className={cn(
                      "border-[#eee] dark:border-dark-3 transition-colors group",
                      isOverdue ? "bg-red-light-1/30 hover:bg-red-light-1/50 dark:bg-red-light-6/10" : "hover:bg-gray-1 dark:hover:bg-dark-3"
                    )}
                  >
                    <TableCell className="px-4">
                      <p className="font-bold text-dark dark:text-white">{r.pelanggan}</p>
                      <p className="text-xs text-dark-5">{r.noPolisi} · {r.kendaraan}</p>
                      <p className="text-xs text-dark-5">{r.phone}</p>
                    </TableCell>
                    <TableCell className="px-4">
                      <div className="flex items-center gap-2">
                        <JenisIcon size={16} className="text-dark-5 shrink-0" />
                        <div>
                          <p className="font-medium text-dark dark:text-white text-sm">{r.jenisReminder}</p>
                          {r.catatan && <p className="text-[10px] text-dark-5">{r.catatan}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <p className={cn("font-semibold text-sm", isOverdue ? "text-red" : "text-dark dark:text-white")}>
                        {dayjs(r.jadwalTanggal).format("DD MMM YYYY")}
                      </p>
                      {isOverdue && (
                        <p className="text-[10px] text-red">
                          Lewat {dayjs().diff(r.jadwalTanggal, "day")} hari
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center px-4">
                      {r.odometerTarget ? (
                        <p className="font-medium text-sm text-dark dark:text-white">
                          {r.odometerTarget.toLocaleString("id-ID")} km
                        </p>
                      ) : (
                        <p className="text-dark-5 text-sm">—</p>
                      )}
                      <p className="text-[10px] text-dark-5">
                        Saat ini: {r.odometerSaat.toLocaleString("id-ID")} km
                      </p>
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <ReminderStatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton
                          icon={<Icons.Notification size={14} />}
                          variant="primary"
                          title="Kirim WA"
                        />
                        <ActionButton
                          icon={<Icons.Delete size={14} />}
                          variant="danger"
                          title="Hapus"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
