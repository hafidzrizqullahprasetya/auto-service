"use client";

import Skeleton from "react-loading-skeleton";
import { Notify } from "@/utils/notify";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ScanBarcode } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Item } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";
import { BarcodeLabelModal, ConfirmDeleteModal } from "@/features/shared";
import { ActionButton, ExcelButtons } from "@/features/shared";
import { InventoryFormModal } from "@/features/inventori";
import { BarcodeExportModal } from "./BarcodeExportModal";
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
    (item.categoryName || "").toLowerCase().includes(v) ||
    item.category.toLowerCase().includes(v)
  );
};

const isLowStock = (item: Item) =>
  item.stock !== undefined &&
  item.minimumStock !== undefined &&
  item.stock <= item.minimumStock;

export function InventoryTable() {
  const {
    data: allItems,
    categories,
    loading,
    error,
    refetch,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory();
  const [barcodeItem, setBarcodeItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showBarcodeExport, setShowBarcodeExport] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "Mobil" | "Motor" | "Umum"
  >("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    Notify.loading("Menyimpan data...");
    try {
      if (editItem) {
        await updateItem(editItem.id, formData);
        Notify.toast("Item berhasil diperbarui!", "success", "top");
      } else {
        await addItem(formData);
        Notify.toast("Item berhasil ditambahkan!", "success", "top");
      }
      setShowAddModal(false);
      setEditItem(null);
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan data";
      Notify.alert("Gagal!", errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      Notify.loading("Menghapus data...");
      await deleteItem(deleteId);
      Notify.toast("Item berhasil dihapus!", "success", "top");
      setDeleteId(null);
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus data";
      Notify.alert("Gagal!", errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };
  // Apply extra filters (tipe & kategori) sebelum masuk TanStack
  const filteredData = useMemo(
    () =>
      allItems.filter((item) => {
        const matchType = filterType === "all" || item.type === filterType;
        const matchCat =
          filterCategory === "all" ||
          item.categoryName === filterCategory ||
          item.category === filterCategory;
        return matchType && matchCat;
      }),
    [allItems, filterType, filterCategory],
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
        accessorKey: "categoryName",
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
              {row.original.categoryName || row.original.category}
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
              onClick={() => setDeleteId(row.original.id)}
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

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm font-bold text-red-600 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
        ⚠ Gagal memuat inventori: {error}
        <button onClick={refetch} className="ml-3 underline">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="hidden md:block">
        <InventorySummary />
      </div>

      <div className="flex flex-col rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        {/* Toolbar custom — ada filter tipe + kategori */}
        <div className="mb-6 flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Inventori Sparepart & Jasa
            </h3>
            <p className="text-sm text-dark-5">
              Kelola stok, harga, dan cetak barcode sparepart
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            {/* Search + Filters (left side) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Icons.Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5"
                />
                <Input
                  placeholder="Cari SKU atau nama item..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-9 sm:w-auto sm:min-w-[220px]"
                />
              </div>
              {/* Filter Tipe */}
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as typeof filterType)
                }
                className="h-9 rounded-lg border border-stroke bg-transparent px-3 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
                className="h-9 rounded-lg border border-stroke bg-transparent px-3 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Excel + Tambah Item (right side) */}
            <div className="flex w-full gap-2 sm:w-auto">
              <ExcelButtons
                moduleKey="inventori"
                exportData={inventoriToExcelRows(filteredData) as any}
                onImport={(rows) => console.log("Import inventori:", rows)}
                className="w-full sm:w-auto"
              />
              <button
                onClick={() => setShowBarcodeExport(true)}
                title="Export semua barcode ke PDF"
                className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-stroke bg-white px-3 text-xs font-bold text-dark-5 transition-colors hover:border-purple-400 hover:text-purple-600 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:border-purple-400 dark:hover:text-purple-400"
              >
                <ScanBarcode size={14} />
                <span className="hidden sm:inline">Barcode PDF</span>
              </button>
              <button
                onClick={() => {
                  setEditItem(null);
                  setShowAddModal(true);
                }}
                className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-opacity-90"
              >
                <Icons.Plus size={16} />
                <span>Tambah Item</span>
              </button>
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
              {loading ? (
                Array.from({
                  length: table.getState().pagination.pageSize,
                }).map((_, i) => (
                  <TableRow
                    key={`skel-${i}`}
                    className="h-[84px] border-b border-stroke bg-white dark:border-dark-3 dark:bg-dark-3"
                  >
                    {columns.map((col, idx) => (
                      <TableCell key={idx} className="px-4 py-0">
                        <Skeleton
                          height={20}
                          className="w-full max-w-[80%]"
                          baseColor="#e2e8f0"
                          highlightColor="#f8fafc"
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
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
          <div className="mt-5 flex flex-col gap-4 border-t border-stroke pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-dark-5">
              Menampilkan{" "}
              <span className="font-bold text-dark">
                {table.getFilteredRowModel().rows.length}
              </span>{" "}
              dari{" "}
              <span className="font-bold text-dark">{allItems.length}</span>{" "}
              data
            </p>

            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20 sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <ChevronLeft size={14} className="sm:h-4 sm:w-4" />
              </button>

              <div className="mx-1 flex items-center gap-0.5 sm:mx-2 sm:gap-1">
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
                        <span className="px-1 text-[8px] font-bold text-dark-5/40 sm:px-2 sm:text-xs">
                          •••
                        </span>
                      )}
                      <button
                        onClick={() => table.setPageIndex(page - 1)}
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black transition-all active:scale-90 sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs",
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke bg-white text-dark-5 transition-all hover:border-dark hover:text-dark active:scale-90 disabled:opacity-20 sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <ChevronRight size={14} className="sm:h-4 sm:w-4" />
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

      {showBarcodeExport && (
        <BarcodeExportModal
          items={filteredData}
          onClose={() => setShowBarcodeExport(false)}
        />
      )}
      {showAddModal && (
        <InventoryFormModal
          categories={categories}
          onClose={() => {
            setShowAddModal(false);
            setEditItem(null);
          }}
          onSave={handleSave}
          initialData={editItem}
          isLoading={isSaving}
        />
      )}

      {deleteId && (
        <ConfirmDeleteModal
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          itemDisplay={allItems.find((i) => i.id === deleteId)?.name}
        />
      )}
    </div>
  );
}
