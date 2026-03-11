"use client";

import { Notify } from "@/utils/notify";
import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Employee } from "@/types/employee";
import { useEmployees } from "@/hooks/useEmployees";
import { Icons } from "@/components/Icons";
import { ActionButton, ExcelButtons, ConfirmDeleteModal } from "@/features/shared";
import { EmployeeFormModal } from "./EmployeeFormModal";
import { karyawanToExcelRows } from "@/lib/excel";

export function EmployeeTable() {
  const {
    data: employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteEmployeeItem, setDeleteEmployeeItem] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show error alert when API fails
  useEffect(() => {
    if (error) {
       Notify.alert("Gagal", `Gagal memuat karyawan: ${error}`, "error");
    }
  }, [error]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    Notify.loading(selectedEmployee ? "Memperbarui data karyawan..." : "Menambahkan karyawan baru...");
    try {
      if (selectedEmployee) {
        await updateEmployee(String(selectedEmployee.id), data);
        Notify.toast("Karyawan berhasil diperbarui!", "success", "top");
      } else {
        await addEmployee(data);
        Notify.toast("Karyawan berhasil ditambahkan!", "success", "top");
      }
      setShowModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      Notify.alert("Gagal", err instanceof Error ? err.message : "Gagal menyimpan data karyawan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteEmployeeItem) return;
    Notify.loading("Menghapus karyawan...");
    setIsDeleting(true);
    try {
      await deleteEmployee(String(deleteEmployeeItem.id));
      Notify.toast("Karyawan berhasil dihapus!", "success", "top");
      setDeleteEmployeeItem(null);
    } catch (err) {
      Notify.alert("Gagal", err instanceof Error ? err.message : "Gagal menghapus karyawan", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Karyawan",
        cell: ({ row }) => {
          const e = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-stroke bg-gray-2 dark:border-dark-4 dark:bg-dark-3">
                <Icons.User size={20} className="text-dark-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold leading-tight text-dark dark:text-white">
                  {e.name}
                </span>
                <span className="text-sm font-medium text-dark-5 mt-1">
                  {e.role}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex items-center gap-1.5">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  status === "Aktif"
                    ? "bg-green-500"
                    : status === "Cuti"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />
              <span className="text-sm font-bold text-dark dark:text-white">
                {status}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "rating",
        header: () => <div className="w-full text-center">Rating</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-1">
            <Icons.Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span className="text-base font-bold text-dark dark:text-white">
              {row.original.rating}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "totalTasks",
        header: () => (
          <div className="w-full text-center font-bold">Total Job</div>
        ),
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <span className="text-base font-bold text-secondary">
              {row.original.totalTasks}{" "}
              <span className="ml-1 text-xs font-medium text-dark-5">
                Unit
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: () => <div className="w-full text-center">WhatsApp</div>,
        cell: ({ row }) => {
          const raw = row.original.phone ?? "";
          // Normalise: strip leading 0, then prepend +62
          const normalised = raw.startsWith("0")
            ? "+62" + raw.slice(1)
            : raw.startsWith("62")
              ? "+" + raw
              : raw.startsWith("+62")
                ? raw
                : raw
                  ? "+62" + raw
                  : null;
          return (
            <div className="flex w-full items-center justify-center gap-2 text-sm font-medium text-dark-5 whitespace-nowrap">
              <Icons.Whatsapp size={14} className="text-secondary" />
              {normalised ?? <span className="italic">—</span>}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2">
            <ActionButton
              variant="view"
              icon={<Icons.Eye size={16} />}
              title="Profil"
              onClick={() => {
                setSelectedEmployee(row.original);
                setShowModal(true);
              }}
            />
            <ActionButton
              variant="edit"
              icon={<Icons.Edit size={16} />}
              title="Edit"
              onClick={() => {
                setSelectedEmployee(row.original);
                setShowModal(true);
              }}
            />
            <ActionButton
              variant="danger"
              icon={<Icons.Delete size={16} />}
              title="Hapus"
              onClick={() => setDeleteEmployeeItem(row.original)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={employees || []}
        isLoading={loading}
        searchable={["name", "role", "phone"]}
        searchPlaceholder="Cari nama atau jabatan..."
        title="Tim & Sumber Daya"
        description="Manajemen staf bengkel, mekanik, dan monitoring produktivitas"
        pageSize={10}
        primaryAction={{
          label: "Tambah Karyawan",
          onClick: () => setShowModal(true),
        }}
        extraActions={
          <ExcelButtons
            moduleKey="karyawan"
            exportData={karyawanToExcelRows(employees) as any}
            onImport={(rows) => console.log("Import karyawan:", rows)}
          />
        }
      />

      {showModal && (
        <EmployeeFormModal
          mode={selectedEmployee ? "edit" : "create"}
          initialData={selectedEmployee || undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedEmployee(null);
          }}
          onSave={handleSave}
          isLoading={isSaving}
        />
      )}

      {deleteEmployeeItem && (
        <ConfirmDeleteModal
          onClose={() => setDeleteEmployeeItem(null)}
          onConfirm={handleConfirmDelete}
          title="Hapus Karyawan"
          description={`Apakah Anda yakin ingin menghapus data karyawan ${deleteEmployeeItem.name}? Akses user terkait akan ikut dicabut.`}
          isLoading={isDeleting}
        />
      )}
    </>
  );
}
