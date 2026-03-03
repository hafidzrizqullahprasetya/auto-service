"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_ITEMS, Item } from "@/mock/inventory";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { BarcodeLabelModal } from "@/components/Bengkel/shared";
import { ActionButton, ExcelButtons } from "@/components/Bengkel/shared";
import { InventoryFormModal } from "@/components/Bengkel/Inventori";
import { InventorySummary } from "./InventorySummary";
import { inventoriToExcelRows } from "@/lib/excel";

// Custom filter function untuk multi-column text search
const multiColFilter: FilterFn<Item> = (
  row,
  _columnId,
  filterValue: string,
) => {
  const v = filterValue.toLowerCase();
  const item = row.original;
  return (
    item.sku.toLowerCase().includes(v) ||
    item.name.toLowerCase().includes(v) ||
    item.category.toLowerCase().includes(v)
  );
};

const isLowStock = (item: Item) =>
  item.stock !== undefined &&
  item.minimumStock !== undefined &&
  item.stock <= item.minimumStock;

export function InventoryTable() {
  const [barcodeItem, setBarcodeItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "Mobil" | "Motor" | "Umum"
  >("all");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "Part" | "Oil" | "Service"
  >("all");

  // Apply extra filters (tipe & kategori) sebelum masuk TanStack
  const filteredData = useMemo(
    () =>
      MOCK_ITEMS.filter((item) => {
        const matchType = filterType === "all" || item.type === filterType;
        const matchCat =
          filterCategory === "all" || item.category === filterCategory;
        return matchType && matchCat;
      }),
    [filterType, filterCategory],
  );

  const columns = useMemo<ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: "sku",
        header: "SKU / Barcode",
        filterFn: multiColFilter,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="rounded bg-gray-2 px-2 py-1 font-mono text-sm font-bold text-dark dark:bg-dark-2 dark:text-white">
                {item.sku}
              </span>
              {item.category !== "Service" && (
                <ActionButton
                  onClick={() => setBarcodeItem(item)}
                  variant="primary"
                  size="sm"
                  icon={<Icons.Print size={14} />}
                  className="group-hover:opacity-100"
                  title="Generate Barcode"
                />
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Nama Item",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div>
              <p className="font-medium text-dark dark:text-white">
                {item.name}
              </p>
              {isLowStock(item) && (
                <span className="text-[10px] font-bold text-red-500">
                  ⚠ Stok Menipis
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: () => <div className="w-full text-center">Kategori</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={
                row.original.category === "Service"
                  ? "warning"
                  : row.original.category === "Oil"
                    ? "info"
                    : "primary"
              }
            >
              {row.original.category}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: () => <div className="w-full text-center">Tipe</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge variant="secondary" outline className="py-0.5 text-[10px]">
              {row.original.type}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Harga Jual",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div>
              <p className="font-bold text-dark dark:text-white">
                Rp {formatNumber(item.price)}
              </p>
              {item.costPrice > 0 && (
                <p className="text-[10px] text-dark-5">
                  Modal: Rp {formatNumber(item.costPrice)}
                </p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "stock",
        header: () => <div className="w-full text-center">Stok</div>,
        cell: ({ row }) => {
          const item = row.original;
          if (item.category === "Service")
            return (
              <div className="flex w-full justify-center text-sm text-dark-5">
                —
              </div>
            );
          return (
            <div
              className={cn(
                "flex w-full justify-center text-sm font-bold",
                isLowStock(item) ? "text-red-500" : "text-dark dark:text-white",
              )}
            >
              {item.stock ?? 0}{" "}
              <span className="ml-1 text-[10px] font-medium text-dark-5">
                {item.unit}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "minimumStock",
        header: () => <div className="w-full text-center">Min. Stok</div>,
        cell: ({ row }) => {
          const item = row.original;
          return item.minimumStock !== undefined ? (
            <div className="flex w-full justify-center text-sm font-medium text-dark-5">
              {item.minimumStock} {item.unit}
            </div>
          ) : (
            <div className="flex w-full justify-center text-sm text-dark-5">
              —
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2 group-hover:opacity-100">
            <ActionButton
              variant="edit"
              title="Edit Item"
              icon={<Icons.Edit size={16} />}
              onClick={() => {
                setEditItem(row.original);
                setShowAddModal(true);
              }}
            />
            <ActionButton
              variant="delete"
              title="Hapus"
              icon={<Icons.Delete size={16} />}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    filterFns: { multiColFilter },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: multiColFilter,
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <InventorySummary />

      <div className="flex flex-col rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        {/* Toolbar custom — ada filter tipe + kategori */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Inventori Sparepart & Jasa
            </h3>
            <p className="text-sm text-dark-5">
              Kelola stok, harga, dan cetak barcode sparepart
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Icons.Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5"
              />
              <Input
                placeholder="Cari SKU atau nama item..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-[220px] pl-9"
              />
            </div>
            {/* Filter Tipe */}
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as typeof filterType)
              }
              className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="all">Semua Tipe</option>
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
              <option value="Umum">Umum</option>
            </select>
            {/* Filter Kategori */}
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as typeof filterCategory)
              }
              className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="Part">Part</option>
              <option value="Oil">Oli</option>
              <option value="Service">Jasa</option>
            </select>
            {/* Excel + Tambah Item (stacked kanan) */}
            <div className="flex flex-col items-end gap-1.5">
              <ExcelButtons
                moduleKey="inventori"
                exportData={inventoriToExcelRows(filteredData) as any}
                onImport={(rows) => console.log("Import inventori:", rows)}
              />
              <Button
                className="w-full"
                onClick={() => {
                  setEditItem(null);
                  setShowAddModal(true);
                }}
              >
                <Icons.Plus size={16} className="mr-1" /> Tambah Item
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="max-w-full flex-1 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow
                  key={hg.id}
                  className="border-b border-stroke bg-gray-2/30 dark:bg-dark-3 [&>th]:py-4 [&>th]:text-xs [&>th]:font-bold [&>th]:text-dark-5"
                >
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "group h-[84px] border-b border-stroke hover:bg-gray-2/50 dark:border-dark-3",
                      isLowStock(row.original) &&
                        "bg-red-50/20 dark:bg-red-900/10",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-0">
                        <div className="flex h-full items-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[300px] text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-1">
                        <Icons.Search
                          size={32}
                          className="text-dark-5 opacity-20"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-dark">
                          Data Tidak Ditemukan
                        </p>
                        <p className="text-xs text-dark-5">
                          Stok atau jasa yang Anda cari tidak tersedia dalam
                          daftar ini
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination - Muncul hanya jika lebih dari 1 halaman */}
        {table.getPageCount() > 1 && (
          <div className="mt-5 flex items-center justify-between border-t border-stroke pt-5">
            <p className="text-xs font-medium text-dark-5">
              Menampilkan{" "}
              <span className="font-bold text-dark">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-dark">{MOCK_ITEMS.length}</span>{" "}
              data
            </p>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="mx-2 flex items-center gap-1">
                {Array.from({ length: table.getPageCount() }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === table.getPageCount() ||
                      Math.abs(
                        p - (table.getState().pagination.pageIndex + 1),
                      ) <= 1,
                  )
                  .map((page, idx, arr) => (
                    <React.Fragment key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-2 text-xs font-bold text-dark-5/40">
                          •••
                        </span>
                      )}
                      <button
                        onClick={() => table.setPageIndex(page - 1)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black transition-all active:scale-90",
                          table.getState().pagination.pageIndex + 1 === page
                            ? "bg-dark text-white"
                            : "text-dark-5 hover:bg-gray-1 hover:text-dark",
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
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {barcodeItem && (
        <BarcodeLabelModal
          item={barcodeItem}
          onClose={() => setBarcodeItem(null)}
        />
      )}
      {showAddModal && (
        <InventoryFormModal
          onClose={() => {
            setShowAddModal(false);
            setEditItem(null);
          }}
          onSave={(data) => {
            console.log(editItem ? "Update:" : "New:", data);
            setShowAddModal(false);
            setEditItem(null);
          }}
          initialData={editItem}
        />
      )}
    </div>
  );
}
