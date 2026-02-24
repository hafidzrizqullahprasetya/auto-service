"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_ANTREAN } from "@/mock/antrean";
import { AntreanRow } from "./AntreanRow";
import { TableToolbar } from "./TableToolbar";
import { AntreanFormModal } from "./AntreanFormModal";

export function AntreanTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredData = useMemo(() => {
    return MOCK_ANTREAN.filter(item => 
      item.noPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kendaraan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pelanggan.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
      <TableToolbar 
        title="Antrean Kendaraan Terkini"
        description="Daftar mobil dan motor yang sedang dalam proses perbaikan"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari no polisi atau pelanggan..."
        primaryAction={{
          label: "Entry Antrean Baru",
          onClick: () => setShowModal(true),
        }}
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[140px] font-bold text-left">No. Polisi</TableHead>
              <TableHead className="min-w-[180px] font-bold text-left">Kendaraan</TableHead>
              <TableHead className="font-bold text-left">Pelanggan</TableHead>
              <TableHead className="font-bold text-left">Layanan</TableHead>
              <TableHead className="font-bold text-left px-4">Waktu Masuk</TableHead>
              <TableHead className="font-bold text-center">Status</TableHead>
              <TableHead className="text-right font-bold pr-4">Opsi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <AntreanRow key={item.id} item={item} />
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={7} className="text-center py-10 text-dark-5">
                  Data tidak ditemukan
                </TableHead>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showModal && (
        <AntreanFormModal 
          onClose={() => setShowModal(false)}
          onSave={(data) => {
            console.log("Saving new queue:", data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
