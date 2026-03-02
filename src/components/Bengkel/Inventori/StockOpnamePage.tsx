"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { TableToolbar } from "@/components/Bengkel/shared";
import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { MOCK_OPNAMES, MOCK_OPEN_OPNAME, StockOpname, OpnameItem } from "@/mock/opname";
import { MOCK_ITEMS } from "@/mock/inventory";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

// ---- Modal Sesi Opname Aktif ----
function ActiveOpnameModal({
  opname,
  onClose,
  onClose: _,
  onFinish,
}: {
  opname: StockOpname;
  onClose: () => void;
  onFinish: () => void;
}) {
  const [items, setItems] = useState<OpnameItem[]>(opname.items);

  const updateCount = (itemId: string, count: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, physicalCount: count, difference: count - item.systemStock }
          : item
      )
    );
  };

  const totalDiff = items.reduce((sum, i) => sum + i.difference, 0);
  const allFilled = items.every((i) => i.physicalCount > 0 || i.systemStock === 0);

  return (
    <BaseModal
      title={`Sesi Opname: ${opname.sessionName}`}
      description="Input jumlah fisik aktual untuk setiap item"
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="3xl"
      footer={
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-dark-5">
            Total Selisih:{" "}
            <span className={cn("font-black", totalDiff < 0 ? "text-red-500" : totalDiff > 0 ? "text-green-600" : "text-secondary")}>
              {totalDiff > 0 ? "+" : ""}{totalDiff} unit
            </span>
          </p>
          <div className="flex gap-3">
            <ActionButton variant="ghost" label="Simpan Sementara" onClick={onClose} />
            <ActionButton
              variant="primary"
              label="Tutup Sesi & Apply"
              onClick={onFinish}
              disabled={!allFilled}
            />
          </div>
        </div>
      }
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-2/30 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-[11px] [&>th]:text-dark-5 [&>th]:font-black [&>th]:uppercase [&>th]:tracking-widest">
              <TableHead className="px-4">Item</TableHead>
              <TableHead className="text-center px-4">Sistem</TableHead>
              <TableHead className="text-center px-4">Aktual</TableHead>
              <TableHead className="text-center px-4">Selisih</TableHead>
              <TableHead className="px-4">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-stroke dark:border-dark-3 h-16">
                <td className="px-4">
                  <p className="font-bold text-sm text-dark dark:text-white">{item.sparePartName}</p>
                  <p className="font-mono text-[10px] text-dark-5">{item.sku}</p>
                </td>
                <td className="text-center px-4 font-bold text-dark dark:text-white">
                  {item.systemStock}
                </td>
                <td className="text-center px-4">
                  <input
                    type="number"
                    min={0}
                    value={item.physicalCount}
                    onChange={(e) => updateCount(item.id, Number(e.target.value))}
                    className="w-20 rounded-lg border border-stroke bg-transparent text-center text-sm font-black text-secondary outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 py-1.5"
                  />
                </td>
                <td className="text-center px-4">
                  <span
                    className={cn(
                      "text-sm font-black",
                      item.difference < 0
                        ? "text-red-500"
                        : item.difference > 0
                        ? "text-green-600"
                        : "text-dark-5"
                    )}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {item.difference}
                  </span>
                </td>
                <td className="px-4">
                  <input
                    type="text"
                    placeholder="Input catatan..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-3 py-1.5 text-xs outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
                  />
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseModal>
  );
}

// ---- Modal Detail Opname (Read-only) ----
function DetailOpnameModal({ opname, onClose }: { opname: StockOpname; onClose: () => void }) {
  return (
    <BaseModal
      title={`Detail Opname: ${opname.sessionName}`}
      description={`Daftar rekonsiliasi stok pada ${dayjs(opname.closedAt || opname.openedAt).format("DD MMMM YYYY")}`}
      icon={<Icons.History size={20} />}
      onClose={onClose}
      maxWidth="3xl"
    >
      <div className="max-h-[60vh] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-2/30 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-[11px] [&>th]:text-dark-5 [&>th]:font-black [&>th]:uppercase [&>th]:tracking-widest">
              <TableHead className="px-4">Item</TableHead>
              <TableHead className="text-center px-4">Sistem</TableHead>
              <TableHead className="text-center px-4">Aktual</TableHead>
              <TableHead className="text-center px-4">Selisih</TableHead>
              <TableHead className="px-4">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opname.items.map((item) => (
              <tr key={item.id} className="border-b border-stroke dark:border-dark-3 h-16">
                <td className="px-4">
                  <p className="font-bold text-sm text-dark dark:text-white">{item.sparePartName}</p>
                  <p className="font-mono text-[10px] text-dark-5">{item.sku}</p>
                </td>
                <td className="text-center px-4 font-bold text-dark dark:text-white">
                  {item.systemStock}
                </td>
                <td className="text-center px-4 font-black text-secondary">
                  {item.physicalCount}
                </td>
                <td className="text-center px-4">
                  <span
                    className={cn(
                      "text-sm font-black",
                      item.difference < 0
                        ? "text-red-500"
                        : item.difference > 0
                        ? "text-green-600"
                        : "text-dark-5"
                    )}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {item.difference}
                  </span>
                </td>
                <td className="px-4 text-xs text-dark-5 max-w-[200px] truncate">
                  {item.note || "—"}
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseModal>
  );
}
export function StockOpnamePage() {
  const [opnames] = useState<StockOpname[]>(MOCK_OPNAMES);
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [selectedOpname, setSelectedOpname] = useState<StockOpname | null>(null);

  const hasOpenSession = MOCK_OPEN_OPNAME.status === "open";

  // ─── TanStack columns untuk riwayat opname ────────────────────────────────
  const opnameColumns = useMemo<ColumnDef<StockOpname>[]>(
    () => [
      {
        accessorKey: "sessionName",
        header: "Nama Sesi",
        cell: ({ row }) => (
          <span className="font-bold text-dark dark:text-white">{row.original.sessionName}</span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              variant={row.original.status === "closed" ? "success" : "warning"}
              className="text-[10px]"
            >
              {row.original.status === "closed" ? "Selesai" : "Berlangsung"}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "openedAt",
        header: "Dibuka",
        cell: ({ row }) => (
          <span className="text-sm text-dark-5">
            {dayjs(row.original.openedAt).format("DD/MM/YYYY HH:mm")}
          </span>
        ),
      },
      {
        accessorKey: "closedAt",
        header: "Ditutup",
        cell: ({ row }) => (
          <span className="text-sm text-dark-5">
            {row.original.closedAt ? dayjs(row.original.closedAt).format("DD/MM/YYYY HH:mm") : "—"}
          </span>
        ),
      },
      {
        accessorKey: "totalItems",
        header: () => <div className="text-center">Total Item</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-dark dark:text-white">
            {row.original.totalItems}
          </div>
        ),
      },
      {
        accessorKey: "totalDifference",
        header: () => <div className="text-center">Total Selisih</div>,
        cell: ({ row }) => {
          const diff = row.original.totalDifference;
          return (
            <div className={cn(
              "text-center font-black text-sm",
              diff < 0 ? "text-red-500" : diff > 0 ? "text-green-600" : "text-dark-5"
            )}>
              {diff > 0 ? "+" : ""}{diff}
            </div>
          );
        },
      },
      {
        accessorKey: "openedBy",
        header: "Oleh",
        cell: ({ row }) => (
          <span className="text-sm text-dark-5">{row.original.openedBy}</span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ActionButton 
              variant="secondary" 
              label="Detail" 
              onClick={() => setSelectedOpname(row.original)}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Panel Sesi Aktif */}
      {hasOpenSession && (
        <div className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark border-l-4 border-l-secondary">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
                <Icons.Inventory size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-dark dark:text-white uppercase tracking-tight">{MOCK_OPEN_OPNAME.sessionName}</h4>
                  <Badge variant="warning" className="text-[9px] py-0">AKTIF</Badge>
                </div>
                <p className="mt-0.5 text-xs font-medium text-dark-5">
                  Oleh: <span className="text-dark dark:text-gray-400">{MOCK_OPEN_OPNAME.openedBy}</span> ·{" "}
                  {dayjs(MOCK_OPEN_OPNAME.openedAt).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>
            <ActionButton
              variant="primary"
              label="Lanjutkan Opname"
              icon={<Icons.Inventory size={16} />}
              onClick={() => setShowActiveModal(true)}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      )}

      {/* Riwayat Opname — TanStack DataTable */}
      <DataTable
        columns={opnameColumns}
        data={opnames}
        searchable={["sessionName", "openedBy"]}
        searchPlaceholder="Cari nama sesi..."
        title="Riwayat Stok Opname"
        description="Rekap sesi rekonsiliasi stok fisik vs sistem"
        primaryAction={
          !hasOpenSession
            ? {
                label: "Mulai Sesi Opname Baru",
                onClick: () => setShowStartConfirm(true),
              }
            : undefined
        }
      />

      {/* Modal Konfirmasi Mulai Sesi */}
      {showStartConfirm && (
        <BaseModal
          title="Mulai Sesi Opname Baru?"
          description="Sistem akan menyiapkan daftar semua item untuk dihitung secara fisik"
          icon={<Icons.Inventory size={20} />}
          onClose={() => setShowStartConfirm(false)}
          maxWidth="sm"
          footer={
            <div className="flex justify-end gap-3">
              <ActionButton variant="ghost" label="Batal" onClick={() => setShowStartConfirm(false)} />
              <ActionButton
                variant="primary"
                label="Mulai Sekarang"
                onClick={() => {
                  setShowStartConfirm(false);
                  setShowActiveModal(true);
                }}
              />
            </div>
          }
        >
          <div className="rounded-lg border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="text-sm text-dark-5">
              Total <strong className="text-secondary">{MOCK_ITEMS.filter(i => i.category !== "Service").length} item</strong> akan masuk dalam sesi opname ini.
              Pastikan semua item fisik sudah siap untuk dihitung.
            </p>
          </div>
        </BaseModal>
      )}

      {/* Modal Sesi Aktif */}
      {showActiveModal && (
        <ActiveOpnameModal
          opname={MOCK_OPEN_OPNAME}
          onClose={() => setShowActiveModal(false)}
          onFinish={() => {
            setShowActiveModal(false);
            alert("Sesi opname ditutup & stok diupdate!");
          }}
        />
      )}
      {/* Modal Detail Opname */}
      {selectedOpname && (
        <DetailOpnameModal
          opname={selectedOpname}
          onClose={() => setSelectedOpname(null)}
        />
      )}
    </div>
  );
}
