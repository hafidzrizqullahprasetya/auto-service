"use client";

import { cn } from "@/lib/utils";
import { Notify } from "@/utils/notify";
import { useState, useMemo, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Item } from "@/types/inventory";
import { useInventory } from "@/hooks/useInventory";
import { formatNumber, formatCurrency } from "@/utils/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { BarcodeLabelModal, ConfirmDeleteModal } from "@/features/shared";
import { ActionButton, ExcelButtons } from "@/features/shared";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { InventoryFormModal } from "./InventoryFormModal";
import { BarcodeExportModal } from "./BarcodeExportModal";
import { InventorySummary } from "./InventorySummary";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { inventoriToExcelRows } from "@/lib/excel";

const isLowStock = (item: Item) =>
  item.stock !== undefined &&
  item.minimumStock !== undefined &&
  item.stock <= item.minimumStock;

export function InventoryTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const {
    data: allItems,
    categories,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    refetch,
  } = useInventory();
  
  const showModalParam = searchParams.get("modal") === "inventory";
  const editIdParam = searchParams.get("id");

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

  // Sync Modal State with URL
  useEffect(() => {
    if (showModalParam) {
      if (editIdParam) {
        const item = allItems.find(i => i.id === editIdParam);
        if (item) {
          setEditItem(item);
          setShowAddModal(true);
        } else if (!loading) {
          setShowAddModal(false);
          setEditItem(null);
        }
      } else {
        setEditItem(null);
        setShowAddModal(true);
      }
    } else {
      setShowAddModal(false);
      setEditItem(null);
    }
  }, [showModalParam, editIdParam, allItems, loading]);

  const updateQueryParams = (show: boolean, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (show) {
      params.set("modal", "inventory");
      if (id) params.set("id", id);
      else params.delete("id");
    } else {
      params.delete("modal");
      params.delete("id");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
      refetch();
      updateQueryParams(false);
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
      Notify.close();
      refetch();
      Notify.toast("Item berhasil dihapus!", "success", "top");
      setDeleteItemData(null);
    } catch (err: any) {
      Notify.close();
      const errorMsg = err instanceof Error ? err.message : "Gagal menghapus data";
      Notify.alert("Gagal!", errorMsg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = useMemo(
    () =>
      allItems.filter((item: Item) => {
        if (item.unit === "jasa") return false;
        
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
        header: () => <div className="w-full text-center">Kategori</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => {
          const categoryName = row.original.categoryName || 
            categories.find(c => String(c.id) === String(row.original.categoryId))?.name || 
            "—";
          
          return (
            <div className="flex w-full justify-center">
              <span className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                {categoryName}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "price",
        header: () => <div className="w-full text-right">Harga Jual</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-end font-bold text-secondary">
            {formatCurrency(row.original.price)}
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
            <div className="hidden sm:flex items-center gap-2">
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
                  updateQueryParams(true, row.original.id);
                }}
              />
              <ActionButton
                variant="delete"
                icon={<Icons.Delete size={16} />}
                title="Hapus"
                onClick={() => setDeleteItemData(row.original)}
              />
            </div>
            <div className="sm:hidden">
              <ActionButton
                variant="edit"
                icon={<Icons.Edit size={16} />}
                onClick={() => {
                  updateQueryParams(true, row.original.id);
                }}
              />
            </div>
          </div>
        ),
      },
    ],
    [categories],
  );

  if (loading && allItems.length === 0) return <InventoryTableSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <InventorySummary data={allItems} loading={loading} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 p-1 bg-gray-1 dark:bg-dark-2 rounded-xl border border-stroke dark:border-dark-3">
          {(["all", "Mobil", "Motor", "Umum"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                "px-3 py-1.5 text-xs font-bold rounded-lg transition-all",
                filterType === t
                  ? "bg-white dark:bg-dark-3 text-primary shadow-sm"
                  : "text-dark-5 hover:text-dark dark:hover:text-white"
              )}
            >
              {t === "all" ? "Semua Tipe" : t}
            </button>
          ))}
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-stroke bg-white px-4 py-2 text-xs font-bold text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        
        {(filterType !== "all" || filterCategory !== "all") && (
          <button 
            onClick={() => {
              setFilterType("all");
              setFilterCategory("all");
            }}
            className="text-xs font-bold text-red hover:underline"
          >
            Reset Filter
          </button>
        )}
      </div>

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
            updateQueryParams(true);
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
          onClose={() => updateQueryParams(false)}
          onSave={handleSave}
          initialData={editItem}
          categories={categories}
          isLoading={isSaving}
          onAddCategory={addCategory}
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
