"use client";

import { Notify } from "@/utils/notify";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { formatNumber } from "@/utils/format-number";
import { Icons } from "@/components/Icons";
import { Badge, ActionButton, ExcelButtons, ConfirmDeleteModal } from "@/features/shared";
import dayjs from "dayjs";
import { DataTable } from "@/components/ui/DataTable";
import { pelangganToExcelRows } from "@/lib/excel";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomerTableSkeleton } from "./CustomerTableSkeleton";

export function CustomerTable() {
  const isMobile = useIsMobile();
  const {
    data,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  useEffect(() => {
    if (error) {
      Notify.alert("Gagal", `Gagal memuat pelanggan: ${error}`, "error");
    }
  }, [error]);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddCustomer = useCallback(() => {
    setSelectedCustomer(null);
    setShowFormModal(true);
  }, []);

  const handleViewCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  }, []);

  const handleEditCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowFormModal(true);
  }, []);

  const handleDeleteCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  }, []);

  const handleConfirmSave = async (formData: any) => {
    Notify.loading("Menyimpan data pelanggan...");
    try {
      setIsSaving(true);
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        Notify.toast("Pelanggan berhasil diperbarui!", "success", "top");
      } else {
        await addCustomer(formData);
        Notify.toast("Pelanggan berhasil ditambahkan!", "success", "top");
      }
      setShowFormModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      Notify.alert("Gagal", err instanceof Error ? err.message : "Gagal menyimpan pelanggan", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    Notify.loading("Menghapus pelanggan...");
    try {
      setIsDeleting(true);
      await deleteCustomer(selectedCustomer.id);
      Notify.toast("Pelanggan berhasil dihapus!", "success", "top");
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      Notify.alert("Gagal", err instanceof Error ? err.message : "Gagal menghapus pelanggan", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => {
      const allColumns: ColumnDef<Customer>[] = [
      {
        accessorKey: "name",
        header: "Nama Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <p className="text-base font-bold leading-tight text-dark dark:text-white">
              {row.original.name}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-dark-5">
              <Icons.Whatsapp size={10} className="text-primary" />
              {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "vehicles",
        header: () => <div className="w-full text-center">Kendaraan</div>,
        cell: ({ row }) => {
          const vehicles = row.original.vehicles;
          const MAX_SHOW = 2;
          const shown = vehicles.slice(0, MAX_SHOW);
          const overflow = vehicles.length - MAX_SHOW;
          return (
            <div className="flex flex-wrap items-center justify-center gap-1">
              {shown.map((v) => (
                <span
                  key={v}
                  title={v}
                  className="inline-block max-w-[110px] truncate rounded border border-stroke bg-gray-2 px-1.5 py-0.5 font-mono text-xs font-bold text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white"
                >
                  {v}
                </span>
              ))}
              {overflow > 0 && (
                <span
                  title={vehicles.slice(MAX_SHOW).join(", ")}
                  className="cursor-default rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary"
                >
                  +{overflow}
                </span>
              )}
              {vehicles.length === 0 && (
                <span className="text-sm text-dark-5">—</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "totalVisits",
        header: () => <div className="w-full text-center">Kunjungan</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center">
            <span className="text-base font-bold text-dark dark:text-white">
              {row.original.totalVisits}
            </span>
            <span className="ml-1 text-xs font-medium text-dark-5">
              Kali
            </span>
          </div>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: () => <div className="w-full text-center">Total Transaksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <p className="text-base font-bold text-secondary">
              Rp {formatNumber(row.original.totalSpent)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "lastVisit",
        header: () => <div className="w-full text-center">Terakhir</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <span className="text-sm font-medium text-dark-5">
              {row.original.lastVisit
                ? dayjs(row.original.lastVisit).format("DD MMM YYYY")
                : "—"}
            </span>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2">
            {/* Quick View */}
            <ActionButton
              variant="view"
              icon={<Icons.Eye size={16} />}
              onClick={() => handleViewCustomer(row.original)}
              title="Lihat Detail"
            />

            {/* Quick Edit */}
            <ActionButton
              variant="edit"
              icon={<Icons.Edit size={16} />}
              onClick={() => handleEditCustomer(row.original)}
              title="Edit Cepat"
            />

            {/* Quick Delete */}
            {!isMobile && (
              <ActionButton
                variant="delete"
                icon={<Icons.Delete size={16} />}
                onClick={() => handleDeleteCustomer(row.original)}
                title="Hapus"
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
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer, isMobile],
  );

  if (loading) return <CustomerTableSkeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={data || []}
        searchable={["name", "phone", "vehicles"]}
        searchPlaceholder="Cari nama, HP, atau plat nomor..."
        pageSize={5}
        title="Database Pelanggan"
        description="Daftar pelanggan tetap dan riwayat loyalitas mereka"
        primaryAction={{
          label: "Tambah Pelanggan",
          onClick: handleAddCustomer,
        }}
        extraActions={
          <ExcelButtons
            moduleKey="pelanggan"
            exportData={pelangganToExcelRows(data) as any}
            onImport={(rows) => console.log("Import pelanggan:", rows)}
          />
        }
      />

      {/* Form Modal (Create/Edit) */}
      {showFormModal && (
        <CustomerFormModal
          mode={selectedCustomer ? "edit" : "create"}
          initialData={selectedCustomer || undefined}
          onClose={() => {
            setShowFormModal(false);
            setSelectedCustomer(null);
          }}
          isLoading={isSaving}
          onSave={handleConfirmSave}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCustomer(null);
          }}
          onEdit={handleEditCustomer}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCustomer && (
        <ConfirmDeleteModal
          title="Hapus Pelanggan?"
          description={`Apakah Anda yakin ingin menghapus profile ${selectedCustomer.name}? Tindakan ini permanen, namun riwayat transaksi tetap diarsipkan.`}
          itemDisplay={selectedCustomer.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
