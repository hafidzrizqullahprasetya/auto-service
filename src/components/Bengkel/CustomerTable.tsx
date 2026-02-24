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
import { MOCK_CUSTOMERS, Customer } from "@/mock/customers";
import { formatNumber } from "@/lib/format-number";
import { Icons } from "@/components/Icons";
import { Badge } from "./Badge";
import dayjs from "dayjs";
import { ActionButton } from "./ActionButton";
import { TableToolbar } from "./TableToolbar";
import { CustomerFormModal } from "./CustomerFormModal";

export function CustomerTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_CUSTOMERS.filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.vehicles.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <TableToolbar 
        title="Database Pelanggan"
        description="Daftar pelanggan tetap dan riwayat loyalitas mereka"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari nama, HP, atau plat nomor..."
        primaryAction={{
          label: "Tambah Pelanggan",
          onClick: () => setShowModal(true),
        }}
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="font-bold text-left px-4">Nama Pelanggan / HP</TableHead>
              <TableHead className="min-w-[150px] font-bold text-left px-4">Kendaraan Terdaftar</TableHead>
              <TableHead className="font-bold text-center px-4">Total Kunjungan</TableHead>
              <TableHead className="font-bold text-left px-4">Total Transaksi</TableHead>
              <TableHead className="font-bold text-left px-4">Terakhir Datang</TableHead>
              <TableHead className="text-right font-bold pr-4">Opsi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((customer) => (
                <TableRow key={customer.id} className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
                  <TableCell className="px-4">
                    <div className="flex flex-col">
                      <p className="font-bold text-dark dark:text-white">{customer.name}</p>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-dark-5">
                        <Icons.History size={10} />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.vehicles.map(v => (
                         <Badge key={v} variant="info" className="text-[9px] px-1.5 py-0">
                           {v}
                         </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-4 font-bold text-dark dark:text-white">
                    {customer.totalVisits} Kali
                  </TableCell>

                  <TableCell className="px-4">
                    <p className="font-black text-secondary">Rp {formatNumber(customer.totalSpent)}</p>
                  </TableCell>

                  <TableCell className="px-4">
                    <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
                      {dayjs(customer.lastVisit).format("DD MMM YYYY")}
                    </span>
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionButton variant="primary" label="Detail" />
                      <ActionButton icon={<Icons.Settings size={16} />} />
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
        <CustomerFormModal 
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log("Saving new customer:", data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

