"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/mock/customers";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { Badge, ActionButton } from "@/components/Bengkel/shared";
import dayjs from "dayjs";
import { DataTable } from "@/components/ui/DataTable";
import { CustomerFormModal } from "./CustomerFormModal";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { useState, useMemo, useCallback } from "react";

interface CustomerTableProps {
  data: Customer[];
  onAddCustomer?: (() => void) | null;
  onEditCustomer?: (customer: Customer) => void;
  onViewCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
  hideAddButton?: boolean;
}

const VISIT_UNIT = "Kali";

export function CustomerTable({
  data,
  onAddCustomer,
  onEditCustomer,
  onViewCustomer,
  onDeleteCustomer,
  hideAddButton = false,
}: CustomerTableProps) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddCustomer = useCallback(() => {
    if (onAddCustomer) {
      onAddCustomer();
    } else {
      setSelectedCustomer(null);
      setShowFormModal(true);
    }
  }, [onAddCustomer]);

  const handleViewCustomer = useCallback(
    (customer: Customer) => {
      if (onViewCustomer) {
        onViewCustomer(customer);
      } else {
        setSelectedCustomer(customer);
        setShowDetailModal(true);
      }
    },
    [onViewCustomer]
  );

  const handleEditCustomer = useCallback(
    (customer: Customer) => {
      if (onEditCustomer) {
        onEditCustomer(customer);
      } else {
        setSelectedCustomer(customer);
        setShowFormModal(true);
      }
    },
    [onEditCustomer]
  );

  const handleDeleteCustomer = useCallback(
    (customer: Customer) => {
      if (onDeleteCustomer) {
        onDeleteCustomer(customer);
      } else {
        setSelectedCustomer(customer);
        setShowDeleteModal(true);
      }
    },
    [onDeleteCustomer]
  );

  const handleConfirmDelete = useCallback(() => {
    setIsDeleting(true);
    // Simulate delete operation
    setTimeout(() => {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedCustomer(null);
    }, 1000);
  }, []);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [

      {
        accessorKey: "name",
        header: "Nama Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <p className="font-bold text-sm text-dark dark:text-white leading-tight">
              {row.original.name}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-dark-5">
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
          <div className="flex w-full flex-wrap gap-1 justify-center max-w-[150px] mx-auto">
            {row.original.vehicles.map((v) => (
              <span
                key={v}
                className="bg-gray-2 dark:bg-dark-3 text-dark dark:text-white text-[10px] px-1.5 py-0.5 rounded font-medium border border-stroke dark:border-dark-4"
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
          <div className="flex w-full justify-center items-center">
            <span className="font-bold text-sm text-dark dark:text-white">{row.original.totalVisits}</span>
            <span className="ml-1 text-[10px] font-medium text-dark-5">Kali</span>
          </div>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: () => <div className="w-full text-center">Total Transaksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <p className="font-bold text-sm text-secondary">
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
    [handleViewCustomer, handleEditCustomer, handleDeleteCustomer]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchable={["name", "phone", "vehicles"]}
        searchPlaceholder="Cari nama, HP, atau plat nomor..."
        pageSize={5}
        title="Database Pelanggan"
        description="Daftar pelanggan tetap dan riwayat loyalitas mereka"
        primaryAction={
          !hideAddButton
            ? {
                label: "Tambah Pelanggan",
                onClick: handleAddCustomer,
              }
            : undefined
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
          onSave={(newCustomer) => {
            console.log("Saving customer:", newCustomer);
            setShowFormModal(false);
            setSelectedCustomer(null);
          }}
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

