"use client";

import { Notify } from "@/utils/notify";
import React, { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Item } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { formatNumber } from "@/utils/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { BarcodeLabelModal, ConfirmDeleteModal } from "@/features/shared";
import { ActionButton, ExcelButtons } from "@/features/shared";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryFormModal } from "./InventoryFormModal";
import { BarcodeExportModal } from "./BarcodeExportModal";
import { InventorySummary } from "./InventorySummary";
import { useIsMobile } from "@/hooks/use-mobile";

import { inventoriToExcelRows } from "@/lib/excel";

const isLowStock = (item: Item) =>
  item.stock !== undefined &&
  item.minimumStock !== undefined &&
  item.stock <= item.minimumStock;

export function InventoryTable() {
  const isMobile = useIsMobile();
  const {
    data: allItems,
    categories,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory();
  
  
  const [barcodeItem, setBarcodeItem] = useState<Item | null>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItemData, setDeleteItemData] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBarcodeExport, setShowBarcodeExport] = useState(false);
  
  // Quick filters
  const [filterType, setFilterType] = useState<"all" | "Mobil" | "Motor" | "Umum">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleSave = async (formData: any) => {
    setIsSaving(true);
    Notify.loading(editItem ? "Memperbarui data item..." : "Menambahkan item baru...");
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
      Notify.alert("Gagal!", errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemData) return;
    try {
      setIsDeleting(true);
      Notify.loading("Menghapus item...");
      await deleteItem(deleteItemData.id);
      Notify.toast("Item berhasil dihapus!", "success", "top");
      setDeleteItemData(null);
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus data";
      Notify.alert("Gagal!", errorMsg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

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
    () => {
      const allColumns: ColumnDef<Item>[] = [
      {
        accessorKey: "name",
        header: "Nama Item & SKU",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <p className="text-base font-bold leading-tight text-dark dark:text-white">
              {row.original.name}
            </p>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-xs font-bold text-dark-5 uppercase">
              {row.original.sku || "Tanpa SKU"}
              <Badge variant={row.original.type === "Mobil" ? "primary" : "info"} outline className="h-4 py-0 text-[9px] font-bold">
                {row.original.type}
              </Badge>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "categoryName",
        header: "Kategori",
        cell: ({ row }) => {
          const categoryName = row.original.categoryName || 
            categories.find(c => String(c.id) === String(row.original.categoryId))?.name || 
            "—";
          
          return (
            <span className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              {categoryName}
            </span>
          );
        },
      },
      {
        accessorKey: "price",
        header: () => <div className="w-full text-right">Harga Jual</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-end font-bold text-secondary">
            Rp {formatNumber(row.original.price)}
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: () => <div className="w-full text-center">Stok</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={isLowStock(row.original) ? "danger" : "success"}
              outline
              className="font-black"
            >
              {row.original.stock} {row.original.unit}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2">
            {!isMobile && (
              <>
                <ActionButton
                  variant="primary"
                  icon={<Icons.Barcode size={16} />}
                  title="Cetak Barcode"
                  onClick={() => setBarcodeItem(row.original)}
                />
                <ActionButton
                  variant="edit"
                  icon={<Icons.Edit size={16} />}
                  title="Edit Item"
                  onClick={() => {
                    setEditItem(row.original);
                    setShowAddModal(true);
                  }}
                />
                <ActionButton
                  variant="delete"
                  icon={<Icons.Delete size={16} />}
                  title="Hapus"
                  onClick={() => setDeleteItemData(row.original)}
                />
              </>
            )}
            {isMobile && (
              <ActionButton
                variant="edit"
                icon={<Icons.Edit size={16} />}
                onClick={() => {
                  setEditItem(row.original);
                  setShowAddModal(true);
                }}
              />
            )}
          </div>
        ),
      },
    ];

    if (isMobile) {
      return allColumns.filter(col => 
        (col as any).accessorKey === "name" || 
        col.id === "actions"
      );
    }

    return allColumns;
  },
    [isMobile, categories],
  );
  if (loading) return <InventoryTableSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <InventorySummary />

      <DataTable
        columns={columns}
        data={filteredData}
        searchable={["name", "sku"]}
        searchPlaceholder="Cari nama atau SKU item..."
        title="Daftar Inventori"
        description="Kelola stok sparepart, oli, ban, dan jasa servis dalam satu tempat"
        pageSize={10}
        primaryAction={{
          label: "Tambah Item",
          onClick: () => {
            setEditItem(null);
            setShowAddModal(true);
          },
        }}
        extraActions={
          <ExcelButtons
            moduleKey="inventori"
            exportData={inventoriToExcelRows(filteredData) as any}
            exportSuffix={`${new Date().toISOString().split("T")[0]}`}
            onSecondaryExport={() => setShowBarcodeExport(true)}
            secondaryLabel="Barcode PDF"
            secondaryIcon={<Icons.Barcode size={16} />}
          />
        }
      />

      {/* Modals */}
      {showAddModal && (
        <InventoryFormModal
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
          initialData={editItem}
          categories={categories}
          isLoading={isSaving}
        />
      )}

      {deleteItemData && (
        <ConfirmDeleteModal
          title="Hapus Item"
          description="Apakah Anda yakin ingin menghapus item ini? Stok item ini akan dihapus permanen dari sistem."
          itemDisplay={deleteItemData.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteItemData(null)}
          isLoading={isDeleting}
        />
      )}

      {barcodeItem && (
        <BarcodeLabelModal
          item={barcodeItem}
          onClose={() => setBarcodeItem(null)}
        />
      )}

      {showBarcodeExport && (
        <BarcodeExportModal
          items={filteredData.filter(i => (i.stock || 0) > 0)}
          onClose={() => setShowBarcodeExport(false)}
        />
      )}
    </div>
  );
}
