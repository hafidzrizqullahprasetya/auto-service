"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_EMPLOYEES, Employee } from "@/mock/employees";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { ActionButton } from "@/components/Bengkel/shared";
import { EmployeeFormModal } from "@/components/Bengkel/Karyawan";

const getStatusVariant = (status: Employee["status"]) => {
  switch (status) {
    case "Aktif": return "success";
    case "Cuti": return "warning";
    case "Off": return "danger";
    default: return "primary";
  }
};

export function EmployeeTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">No.</div>,
        cell: ({ row }) => (
          <div className="text-center font-bold text-dark-5">
            {row.index + 1}
          </div>
        ),
        size: 50,
      },
      {
        accessorKey: "name",
        header: "Nama Karyawan",
        cell: ({ row }) => {
          const e = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-2 dark:bg-dark-3 flex items-center justify-center border border-stroke dark:border-dark-4">
                <Icons.User size={20} className="text-dark-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-dark dark:text-white uppercase leading-none">
                  {e.name}
                </span>
                <span className="text-[10px] font-bold text-dark-5 uppercase tracking-wider">{e.role}</span>
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
              <div className={`h-1.5 w-1.5 rounded-full ${
                status === "Aktif" ? "bg-green-500" : status === "Cuti" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <span className="text-[11px] font-black uppercase text-dark dark:text-white tracking-widest">{status}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "rating",
        header: () => <div className="text-center">Rating</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <Icons.Star size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-black text-dark dark:text-white">{row.original.rating}</span>
          </div>
        ),
      },
      {
        accessorKey: "totalTasks",
        header: () => <div className="text-center font-bold">Total Job</div>,
        cell: ({ row }) => (
          <div className="text-center">
            <span className="text-sm font-black text-secondary">
              {row.original.totalTasks} <span className="text-[9px] uppercase font-bold text-dark-5 ml-1">Unit</span>
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "WhatsApp",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-[11px] font-black text-dark-5">
            <Icons.Whatsapp size={12} />
            +62{row.original.phone}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <ActionButton 
              variant="outline" 
              icon={<Icons.Eye size={16} />} 
              title="Profil" 
              onClick={() => {
                setSelectedEmployee(row.original);
                setShowModal(true);
              }}
            />
            <ActionButton 
              variant="outline" 
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
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={MOCK_EMPLOYEES}
        searchable={["name", "role", "phone"]}
        searchPlaceholder="Cari nama atau jabatan..."
        title="Tim & Sumber Daya"
        description="Manajemen staf bengkel, mekanik, dan monitoring produktivitas"
        primaryAction={{
          label: "Tambah Karyawan",
          onClick: () => setShowModal(true),
        }}
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
