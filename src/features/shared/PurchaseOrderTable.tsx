"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_PURCHASE_ORDERS, PurchaseOrder } from "@/mock/service-history";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type POStatus = PurchaseOrder["status"];

const STATUS_VARIANT: Record<POStatus, "warning" | "primary" | "success" | "danger"> = {
  Draft: "warning",
  Dikirim: "primary",
  Diterima: "success",
  Dibatalkan: "danger",
};

const STATUS_STEPS: POStatus[] = ["Draft", "Dikirim", "Diterima"];

function POProgressBar({ status }: { status: POStatus }) {
  if (status === "Dibatalkan") {
    return <span className="text-xs text-red-500 font-medium">Dibatalkan</span>;
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div className={cn("h-2 w-2 rounded-full", i <= currentIdx ? "bg-dark" : "bg-gray-3 dark:bg-dark-3")} />
          {i < STATUS_STEPS.length - 1 && (
            <div className={cn("h-0.5 w-6", i < currentIdx ? "bg-dark" : "bg-gray-3 dark:bg-dark-3")} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Expanded detail row ─────────────────────────────────────────────────────
function ExpandedDetail({ row }: { row: Row<PurchaseOrder> }) {
  const po = row.original;
  return (
    <TableRow className="bg-gray-1 dark:bg-dark-2">
      <TableCell colSpan={8} className="px-6 py-3">
        <div className="grid gap-2">
          {po.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-mono text-xs bg-gray-2 dark:bg-dark-3 px-1.5 py-0.5 rounded mr-2">
                  {item.sku}
                </span>
                <span className="text-dark dark:text-white">{item.nama}</span>
                <span className="text-dark-5 ml-2">× {item.qty}</span>
              </div>
              <span className="font-semibold text-dark dark:text-white">
                Rp {formatNumber(item.hargaSatuan * item.qty)}
              </span>
            </div>
          ))}
          {po.catatan && (
            <p className="text-xs text-dark-5 mt-1 italic">📝 {po.catatan}</p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Summary cards ─────────────────────────────────────────────────────────────
function POSummary() {
  const totalNilai = MOCK_PURCHASE_ORDERS.filter((po) => po.status !== "Dibatalkan").reduce((acc, po) => acc + po.totalNilai, 0);
  const draft = MOCK_PURCHASE_ORDERS.filter((po) => po.status === "Draft").length;
  const dikirim = MOCK_PURCHASE_ORDERS.filter((po) => po.status === "Dikirim").length;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
      {[
        { label: "Total PO Aktif", value: MOCK_PURCHASE_ORDERS.length, icon: Icons.Database },
        { label: "Draft", value: draft, icon: Icons.Pending },
        { label: "Dikirim", value: dikirim, icon: Icons.Antrean },
        { label: "Total Nilai PO", value: `Rp ${formatNumber(totalNilai)}`, icon: Icons.Cash },
      ].map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-gray-2 dark:bg-dark-2 flex items-center justify-center text-dark dark:text-white">
            <Icon size={20} />
          </div>
          <div>
            <p className="font-black text-base text-dark dark:text-white">{value}</p>
            <p className="text-xs text-dark-5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PurchaseOrderTable() {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<PurchaseOrder>[]>(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="text-dark-5 p-1 hover:text-dark transition-colors"
          >
            {row.getIsExpanded() ? <Icons.ArrowUp size={14} /> : <Icons.ArrowDown size={14} />}
          </button>
        ),
        size: 40,
      },
      {
        accessorKey: "noPO",
        header: "No. PO / Tanggal",
        cell: ({ row }) => {
          const po = row.original;
          return (
            <div>
              <p className="font-mono text-xs font-bold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2 py-1 rounded w-fit">
                {po.noPO}
              </p>
              <p className="text-xs text-dark-5 mt-1">{dayjs(po.tanggal).format("DD MMM YYYY")}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => (
          <span className="font-medium text-dark dark:text-white">{row.original.supplier}</span>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge variant={STATUS_VARIANT[row.original.status]}>{row.original.status}</Badge>
          </div>
        ),
      },
      {
        id: "progress",
        header: () => <div className="text-center">Progress</div>,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <POProgressBar status={row.original.status} />
          </div>
        ),
      },
      {
        accessorKey: "totalNilai",
        header: "Total Nilai",
        cell: ({ row }) => (
          <p className="font-black text-dark dark:text-white">
            Rp {formatNumber(row.original.totalNilai)}
          </p>
        ),
      },
      {
        accessorKey: "estimasiTiba",
        header: "Est. Tiba",
        cell: ({ row }) => (
          <p className="text-sm text-dark dark:text-white">
            {row.original.estimasiTiba ? dayjs(row.original.estimasiTiba).format("DD MMM YYYY") : "—"}
          </p>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right pr-2">Aksi</div>,
        cell: () => (
          <div className="flex items-center justify-end gap-2">
            <ActionButton variant="view" title="Lihat Detail" icon={<Icons.Eye size={16} />} />
            <ActionButton variant="delete" title="Hapus" icon={<Icons.Delete size={16} />} />
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: MOCK_PURCHASE_ORDERS,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <POSummary />

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">Purchase Order (PO) Stok</h3>
            <p className="text-sm text-dark-5">Kelola pemesanan dan pembelian stok dari supplier</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
              <Input
                placeholder="Cari supplier atau nomor PO..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9 max-w-[250px]"
              />
            </div>
            <ActionButton variant="outline" label="Export PO" icon={<Icons.Print size={16} />} />
            <Button>Buat PO Baru</Button>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                  {hg.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.flatMap((row) => [
                  <TableRow
                    key={row.id}
                    className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group cursor-pointer"
                    onClick={row.getToggleExpandedHandler()}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>,
                  row.getIsExpanded() ? (
                    <ExpandedDetail key={`${row.id}-exp`} row={row} />
                  ) : null,
                ])
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-dark-5">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between border-t border-stroke pt-5 mt-5">
            <p className="text-xs font-medium text-dark-5">
              Menampilkan{" "}
              <span className="font-bold text-dark">{table.getFilteredRowModel().rows.length}</span>{" "}
              dari <span className="font-bold text-dark">{MOCK_PURCHASE_ORDERS.length}</span> data
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark disabled:opacity-20 active:scale-90"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === table.getPageCount() || Math.abs(p - (table.getState().pagination.pageIndex + 1)) <= 1)
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-xs font-bold text-dark-5/40">•••</span>
                      )}
                      <button
                        onClick={() => table.setPageIndex(page - 1)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all active:scale-90",
                          table.getState().pagination.pageIndex + 1 === page
                            ? "bg-dark text-white shadow-lg shadow-dark/20"
                            : "text-dark-5 hover:bg-gray-1 hover:text-dark"
                        )}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
              </div>

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark disabled:opacity-20 active:scale-90"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
