"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_EMPLOYEES, Employee } from "@/mock/employees";
import { Badge } from "./Badge";
import { Icons } from "@/components/Icons";
import { ActionButton } from "./ActionButton";
import { TableToolbar } from "./TableToolbar";
import { EmployeeFormModal } from "./EmployeeFormModal";

export function EmployeeTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_EMPLOYEES.filter(employee => 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStatusVariant = (status: Employee["status"]) => {
    switch (status) {
      case "Aktif": return "success";
      case "Cuti": return "warning";
      case "Off": return "danger";
      default: return "primary";
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <TableToolbar 
        title="Manajemen Karyawan & Mekanik"
        description="Pantau kinerja, status kehadiran, dan penugasan tim bengkel"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari nama atau jabatan..."
        primaryAction={{
          label: "Tambah Karyawan",
          onClick: () => setShowModal(true),
        }}
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="font-bold text-left px-4">Nama Karyawan</TableHead>
              <TableHead className="font-bold text-left px-4">Jabatan</TableHead>
              <TableHead className="font-bold text-center px-4">Status</TableHead>
              <TableHead className="font-bold text-left px-4">Total Job (Selesai)</TableHead>
              <TableHead className="font-bold text-center px-4">Rating</TableHead>
              <TableHead className="text-right font-bold pr-4">Opsi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((employee) => (
                <TableRow key={employee.id} className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
                  <TableCell className="px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                         {employee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-dark dark:text-white">{employee.name}</p>
                        <p className="text-[10px] font-medium text-dark-5">{employee.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <Icons.Karyawan size={14} className="text-dark-5" />
                      <span className="text-sm font-bold text-dark-4 dark:text-dark-6">{employee.role}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <Badge variant={getStatusVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-dark dark:text-white">
                        {employee.totalTasks > 0 ? `${employee.totalTasks} Unit` : "-"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <div className="flex items-center justify-center gap-1 text-orange-500 font-bold">
                      <Icons.History size={14} className="fill-current" />
                      <span>{employee.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-4 text-sm">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionButton variant="primary" label="Profile" />
                      <ActionButton variant="ghost" label="Edit" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={6} className="text-center py-10 text-dark-5">
                  Data tidak ditemukan
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showModal && (
        <EmployeeFormModal 
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log("Saving new employee:", data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

