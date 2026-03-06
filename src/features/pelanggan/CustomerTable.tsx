"use client";

import toast from "react-hot-toast";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/mock/customers";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { Badge, ActionButton, ExcelButtons } from "@/features/shared";
import dayjs from "dayjs";
import { DataTable } from "@/components/ui/DataTable";
import { pelangganToExcelRows } from "@/lib/excel";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";

export function CustomerTable() {
  const {
    data,
    loading,
    error,
    refetch,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  // Show error toast when API fails
  useEffect(() => {
    if (error) {
      toast.error(`Gagal memuat pelanggan: ${error}`);
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
    try {
      setIsSaving(true);
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        toast.success("Pelanggan berhasil diperbarui!");
      } else {
        await addCustomer(formData);
        toast.success("Pelanggan berhasil ditambahkan!");
      }
      setShowFormModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menyimpan pelanggan",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    try {
      setIsDeleting(true);
      await deleteCustomer(selectedCustomer.id);
      toast.success("Pelanggan berhasil dihapus!");
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal menghapus pelanggan",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <p className="text-sm font-bold leading-tight text-dark dark:text-white">
              {row.original.name}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-dark-5">
              <Icons.Whatsapp size={10} className="text-primary" />
              {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "vehicles",
        header: () => <div className="w-full text-center">Kendaraan</div>,
        cell: ({ row }) => (
          <div className="mx-auto flex w-full max-w-[150px] flex-wrap justify-center gap-1">
            {row.original.vehicles.map((v) => (
              <span
                key={v}
                className="rounded border border-stroke bg-gray-2 px-1.5 py-0.5 text-[10px] font-medium text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white"
              >
                {v}
              </span>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "totalVisits",
        header: () => <div className="w-full text-center">Kunjungan</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center">
            <span className="text-sm font-bold text-dark dark:text-white">
              {row.original.totalVisits}
            </span>
            <span className="ml-1 text-[10px] font-medium text-dark-5">
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
            <p className="text-sm font-bold text-secondary">
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
            <span className="text-xs font-medium text-dark-5">
              {dayjs(row.original.lastVisit).format("DD MMM YYYY")}
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
            <ActionButton
              variant="delete"
              icon={<Icons.Delete size={16} />}
              onClick={() => handleDeleteCustomer(row.original)}
              title="Hapus"
            />
          </div>
        ),
      },
    ],
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={loading}
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
        <DeleteConfirmModal
          customer={selectedCustomer}
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
