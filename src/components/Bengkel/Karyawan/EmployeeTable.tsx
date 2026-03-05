"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Employee } from "@/mock/employees";
import { useEmployees } from "@/hooks/useEmployees";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { ActionButton, ExcelButtons } from "@/components/Bengkel/shared";
import { EmployeeFormModal } from "@/components/Bengkel/Karyawan";
import { karyawanToExcelRows } from "@/lib/excel";

const getStatusVariant = (status: Employee["status"]) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Cuti":
      return "warning";
    case "Off":
      return "danger";
    default:
      return "primary";
  }
};

export function EmployeeTable() {
  const { data: employees, loading } = useEmployees();
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

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
                <span className="text-sm font-bold leading-none text-dark dark:text-white">
                  {e.name}
                </span>
                <span className="text-[11px] font-medium text-dark-5">
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
              <span className="text-xs font-bold text-dark dark:text-white">
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
            <Icons.Star size={12} className="fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-bold text-dark dark:text-white">
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
            <span className="text-sm font-bold text-secondary">
              {row.original.totalTasks}{" "}
              <span className="ml-1 text-[10px] font-medium text-dark-5">
                Unit
              </span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: () => <div className="w-full text-center">WhatsApp</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2 text-xs font-medium text-dark-5">
            <Icons.Whatsapp size={12} />
            +62{row.original.phone}
          </div>
        ),
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
        data={loading ? [] : employees}
        searchable={["name", "role", "phone"]}
        searchPlaceholder="Cari nama atau jabatan..."
        title="Tim & Sumber Daya"
        description="Manajemen staf bengkel, mekanik, dan monitoring produktivitas"
        pageSize={5}
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
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log("Saving:", data);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
