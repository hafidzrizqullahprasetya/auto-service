"use client";

import Skeleton from "react-loading-skeleton";
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
import { Badge } from "@/features/shared";
import { ActionButton } from "@/features/shared";
import { TableToolbar } from "@/features/shared";
import { BaseModal } from "@/features/shared";
import { StockOpnameTableSkeleton } from "./StockOpnameTableSkeleton";
import { Icons } from "@/components/Icons";
import { StockOpname, OpnameItem } from "@/types/opname";
import { useInventory } from "@/hooks/useInventory";
import { useOpnames } from "@/hooks/useOpnames";
import dayjs from "dayjs";
import { Notify } from "@/utils/notify";
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
          ? {
              ...item,
              physicalCount: count,
              difference: count - item.systemStock,
            }
          : item,
      ),
    );
  };

  const totalDiff = items.reduce((sum, i) => sum + i.difference, 0);
  const allFilled = items.every(
    (i) => i.physicalCount > 0 || i.systemStock === 0,
  );

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
            <span
              className={cn(
                "font-bold",
                totalDiff < 0
                  ? "text-red-500"
                  : totalDiff > 0
                    ? "text-green-600"
                    : "text-secondary",
              )}
            >
              {totalDiff > 0 ? "+" : ""}
              {totalDiff} unit
            </span>
          </p>
          <div className="flex gap-3">
            <ActionButton
              variant="ghost"
              label="Simpan Sementara"
              onClick={onClose}
            />
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
            <TableRow className="bg-gray-2/30 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-xs [&>th]:font-bold [&>th]:text-dark-5">
              <TableHead className="px-4">Item</TableHead>
              <TableHead className="px-4 text-center">Sistem</TableHead>
              <TableHead className="px-4 text-center">Aktual</TableHead>
              <TableHead className="px-4 text-center">Selisih</TableHead>
              <TableHead className="px-4">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="h-16 border-b border-stroke dark:border-dark-3"
              >
                <td className="px-4">
                  <p className="text-sm font-bold text-dark dark:text-white">
                    {item.sparePartName}
                  </p>
                  <p className="font-mono text-[10px] text-dark-5">
                    {item.sku}
                  </p>
                </td>
                <td className="px-4 text-center font-bold text-dark dark:text-white">
                  {item.systemStock}
                </td>
                <td className="px-4 text-center">
                  <input
                    type="number"
                    min={0}
                    value={item.physicalCount}
                    onChange={(e) =>
                      updateCount(item.id, Number(e.target.value))
                    }
                    className="w-20 rounded-lg border border-stroke bg-transparent py-1.5 text-center text-sm font-bold text-secondary outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
                  />
                </td>
                <td className="px-4 text-center">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      item.difference < 0
                        ? "text-red-500"
                        : item.difference > 0
                          ? "text-green-600"
                          : "text-dark-5",
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
function DetailOpnameModal({
  opname,
  onClose,
}: {
  opname: StockOpname;
  onClose: () => void;
}) {
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
            <TableRow className="bg-gray-2/30 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-xs [&>th]:font-bold [&>th]:text-dark-5">
              <TableHead className="px-4">Item</TableHead>
              <TableHead className="px-4 text-center">Sistem</TableHead>
              <TableHead className="px-4 text-center">Aktual</TableHead>
              <TableHead className="px-4 text-center">Selisih</TableHead>
              <TableHead className="px-4">Catatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opname.items.map((item) => (
              <tr
                key={item.id}
                className="h-16 border-b border-stroke dark:border-dark-3"
              >
                <td className="px-4">
                  <p className="text-sm font-bold text-dark dark:text-white">
                    {item.sparePartName}
                  </p>
                  <p className="font-mono text-[10px] text-dark-5">
                    {item.sku}
                  </p>
                </td>
                <td className="px-4 text-center font-bold text-dark dark:text-white">
                  {item.systemStock}
                </td>
                <td className="px-4 text-center font-bold text-secondary">
                  {item.physicalCount}
                </td>
                <td className="px-4 text-center">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      item.difference < 0
                        ? "text-red-500"
                        : item.difference > 0
                          ? "text-green-600"
                          : "text-dark-5",
                    )}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {item.difference}
                  </span>
                </td>
                <td className="max-w-[200px] truncate px-4 text-xs text-dark-5">
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
export function StockOpnameTable() {
  const { data: inventoryItems } = useInventory();
  const { data: opnames, loading, error } = useOpnames();
  const [showActiveModal, setShowActiveModal] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [selectedOpname, setSelectedOpname] = useState<StockOpname | null>(
    null,
  );

  // Find open opname from data
  const hasOpenSession = opnames.some((o) => o.status === "open");
  const activeOpname = opnames.find((o) => o.status === "open");

  // ─── TanStack columns untuk riwayat opname ────────────────────────────────
  const opnameColumns = useMemo<ColumnDef<StockOpname>[]>(
    () => [
      {
        accessorKey: "sessionName",
        header: "Nama Sesi",
        cell: ({ row }) => (
          <span className="font-bold text-dark dark:text-white">
            {row.original.sessionName}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="w-full text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
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
            {row.original.closedAt
              ? dayjs(row.original.closedAt).format("DD/MM/YYYY HH:mm")
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "totalItems",
        header: () => <div className="w-full text-center">Total Item</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center font-bold text-dark dark:text-white">
            {row.original.totalItems}
          </div>
        ),
      },
      {
        accessorKey: "totalDifference",
        header: () => <div className="w-full text-center">Total Selisih</div>,
        cell: ({ row }) => {
          const diff = row.original.totalDifference;
          return (
            <div
              className={cn(
                "flex w-full justify-center text-sm font-bold",
                diff < 0
                  ? "text-red-500"
                  : diff > 0
                    ? "text-green-600"
                    : "text-dark-5",
              )}
            >
              {diff > 0 ? "+" : ""}
              {diff}
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
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <ActionButton
              variant="view"
              icon={<Icons.Eye size={16} />}
              title="Lihat Detail"
              onClick={() => setSelectedOpname(row.original)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  if (loading) return <StockOpnameTableSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      {/* Panel Sesi Aktif */}
      {hasOpenSession && (
        <div className="rounded-[10px] border border-l-4 border-stroke border-l-secondary bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
                <Icons.Inventory size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold tracking-tight text-dark dark:text-white">
                    {activeOpname?.sessionName}
                  </h4>
                  <Badge variant="warning" className="py-0 text-[9px]">
                    Aktif
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs font-medium text-dark-5">
                  Oleh:{" "}
                  <span className="text-dark dark:text-gray-400">
                    {activeOpname?.openedBy}
                  </span>{" "}
                  · {dayjs(activeOpname?.openedAt).format("DD/MM/YYYY HH:mm")}
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
        pageSize={5}
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
              <ActionButton
                variant="ghost"
                label="Batal"
                onClick={() => setShowStartConfirm(false)}
              />
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
              Total{" "}
              <strong className="text-secondary">
                {inventoryItems.filter((i) => i.category !== "Service").length}{" "}
                item
              </strong>{" "}
              akan masuk dalam sesi opname ini. Pastikan semua item fisik sudah
              siap untuk dihitung.
            </p>
          </div>
        </BaseModal>
      )}

      {/* Modal Sesi Aktif */}
      {showActiveModal && activeOpname && (
        <ActiveOpnameModal
          opname={activeOpname}
          onClose={() => setShowActiveModal(false)}
          onFinish={() => {
            setShowActiveModal(false);
            Notify.toast("Sesi opname ditutup & stok diupdate!", "success", "top");
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
