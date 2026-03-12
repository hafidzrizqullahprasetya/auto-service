"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ApiCategory } from "@/types/api";
import { ActionButton, ConfirmDeleteModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { useInventory } from "@/hooks/useInventory";
import { CategoryFormModal } from "./CategoryFormModal";
import { Notify } from "@/utils/notify";
import { CategoryListSkeleton } from "./CategoryListSkeleton";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { UnitList } from "./UnitList";
import { cn } from "@/lib/utils";

export function CategoryList() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useInventory();
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const showFormParam = searchParams.get("modal") === "category";
  const editIdParam = searchParams.get("id");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ApiCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<ApiCategory | null>(null);

  // Sync state with URL params on mount or param change
  useEffect(() => {
    if (showFormParam) {
      if (editIdParam) {
        const cat = categories.find(c => c.id === Number(editIdParam));
        if (cat) {
          setEditingCategory(cat);
          setShowForm(true);
        } else if (!loading) {
          // If ID not found and not loading, close modal or just show add
          setShowForm(false);
          setEditingCategory(null);
        }
      } else {
        setEditingCategory(null);
        setShowForm(true);
      }
    } else {
      setShowForm(false);
      setEditingCategory(null);
    }
  }, [showFormParam, editIdParam, categories, loading]);

  const updateQueryParams = (show: boolean, id?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (show) {
      params.set("modal", "category");
      if (id) params.set("id", id.toString());
      else params.delete("id");
    } else {
      params.delete("modal");
      params.delete("id");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const columns: ColumnDef<ApiCategory>[] = [
    {
      accessorKey: "id",
      header: () => <div className="w-full text-center">ID</div>,
      cell: ({ row }) => (
        <div className="flex w-full justify-center">
          <span className="font-mono text-xs">{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Kategori",
      cell: ({ row }) => <span className="font-bold text-dark dark:text-white">{row.original.name}</span>,
    },
    {
      id: "actions",
      header: () => <div className="w-full text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex w-full justify-end gap-2">
          <ActionButton
            variant="edit"
            icon={<Icons.Edit size={16} />}
            onClick={() => {
              updateQueryParams(true, row.original.id);
            }}
          />
          <ActionButton
            variant="delete"
            icon={<Icons.Delete size={16} />}
            onClick={() => setDeletingCategory(row.original)}
          />
        </div>
      ),
    },
  ];

  const handleSave = async (name: string) => {
    try {
      Notify.loading(editingCategory ? "Memperbarui kategori..." : "Menambahkan kategori...");
      if (editingCategory) {
        await updateCategory(editingCategory.id, name);
        Notify.close();
        Notify.toast("Kategori berhasil diperbarui", "success");
      } else {
        await addCategory(name);
        Notify.close();
        Notify.toast("Kategori baru ditambahkan", "success");
      }
      localStorage.removeItem("category_form_draft");
      updateQueryParams(false);
    } catch (err: any) {
      Notify.close();
      Notify.alert("Gagal", err.message || "Gagal menyimpan kategori", "error");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      Notify.loading("Menghapus kategori...");
      await deleteCategory(deletingCategory.id);
      Notify.close();
      Notify.toast("Kategori berhasil dihapus", "success");
      setDeletingCategory(null);
    } catch (err: any) {
      Notify.close();
      Notify.alert("Gagal", err.message || "Gagal menghapus kategori", "error");
    }
  };

  const [activeTab, setActiveTab] = useState<"category" | "unit">("category");

  if (loading && categories.length === 0) return <CategoryListSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-gray-1 dark:bg-dark-2 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab("category")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === "category"
              ? "bg-white dark:bg-dark-3 text-primary shadow-sm"
              : "text-dark-5 hover:text-dark dark:hover:text-white"
          )}
        >
          <Icons.Inventory size={16} />
          Kategori
        </button>
        <button
          onClick={() => setActiveTab("unit")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all",
            activeTab === "unit"
              ? "bg-white dark:bg-dark-3 text-primary shadow-sm"
              : "text-dark-5 hover:text-dark dark:hover:text-white"
          )}
        >
          <Icons.Antrean size={16} />
          Satuan
        </button>
      </div>

      {activeTab === "category" ? (
        <>
          <DataTable
            columns={columns}
            data={categories}
            pageSize={10}
            title="Manajemen Kategori"
            description="Kelola kategori produk dan jasa untuk pengelompokan inventori"
            searchable={["name"]}
            searchPlaceholder="Cari kategori..."
            primaryAction={{
              label: "Tambah Kategori",
              onClick: () => {
                updateQueryParams(true);
              },
            }}
          />

          {showForm && (
            <CategoryFormModal
              onClose={() => {
                updateQueryParams(false);
              }}
              onSave={handleSave}
              initialData={editingCategory}
            />
          )}

          {deletingCategory && (
            <ConfirmDeleteModal
              title="Hapus Kategori?"
              description={`Anda yakin ingin menghapus kategori "${deletingCategory.name}"? Ini tidak akan menghapus item di dalamnya, tapi item tersebut mungkin tidak memiliki kategori lagi.`}
              onClose={() => setDeletingCategory(null)}
              onConfirm={handleDelete}
            />
          )}
        </>
      ) : (
        <UnitList />
      )}
    </div>
  );
}
