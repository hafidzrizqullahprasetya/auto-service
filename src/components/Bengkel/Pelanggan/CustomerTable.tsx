"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/mock/customers";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/icons";
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
        id: "no",
        header: () => <div className="text-center">No.</div>,
        cell: ({ row }) => (
          <div className="text-center font-medium text-dark dark:text-white">
            {row.index + 1}
          </div>
        ),
        size: 60,
      },
      {
        accessorKey: "name",
        header: "Nama Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col items-center text-center">
            <p className="font-bold text-dark dark:text-white">
              {row.original.name}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-medium text-dark-5">
              <Icons.Whatsapp size={10} />
              {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "vehicles",
        header: () => <div className="text-center">Kendaraan Terdaftar</div>,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 justify-center">
            {row.original.vehicles.map((v) => (
              <Badge
                key={v}
                variant="info"
                className="text-[9px] px-1.5 py-0"
              >
                {v}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "totalVisits",
        header: () => <div className="text-center">Total Kunjungan</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-dark dark:text-white">
            {row.original.totalVisits} {VISIT_UNIT}
          </div>
        ),
      },
      {
        accessorKey: "totalSpent",
        header: () => <div className="text-center">Total Transaksi</div>,
        cell: ({ row }) => (
          <p className="text-center font-black text-primary">
            Rp {formatNumber(row.original.totalSpent)}
          </p>
        ),
      },
      {
        accessorKey: "lastVisit",
        header: () => <div className="text-center">Terakhir Datang</div>,
        cell: ({ row }) => (
          <span className="text-center text-sm font-medium text-dark-5 dark:text-dark-6">
            {dayjs(row.original.lastVisit).format("DD MMM YYYY")}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-2">
            {/* Quick View */}
            <ActionButton
              variant="outline"
              icon={<Icons.Eye size={16} />}
              onClick={() => handleViewCustomer(row.original)}
              tooltip="Lihat Detail"
            />

            {/* Quick Edit */}
            <ActionButton
              variant="outline"
              icon={<Icons.Edit size={16} />}
              onClick={() => handleEditCustomer(row.original)}
              tooltip="Edit Cepat"
            />

            {/* Quick Delete */}
            <ActionButton
              variant="outline"
              icon={<Icons.Delete size={16} className="text-red-600" />}
              onClick={() => handleDeleteCustomer(row.original)}
              tooltip="Hapus"
              className="hover:bg-red-50 dark:hover:bg-red-900/20"
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
        pageSize={10}
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

