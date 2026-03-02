"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Antrean } from "@/mock/antrean";
import { ActionButton, Badge, ConfirmDeleteModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { AntreanFormModal } from "./AntreanFormModal";
import { SPKModal } from "./SPKModal";
import dayjs from "dayjs";

const getStatusVariant = (status: Antrean["status"]) => {
  switch (status) {
    case "Selesai":            return "success"  as const;
    case "Menunggu":           return "danger"   as const;
    case "Dikerjakan":         return "info"     as const;
    case "Menunggu Sparepart": return "warning"  as const;
    default:                   return "neutral"  as const;
  }
};

interface AntreanTableProps {
  data: Antrean[];
}

export function AntreanTable({ data }: AntreanTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Antrean | null>(null);

  const handleAction = (item: Antrean, type: "print" | "edit" | "delete") => {
    setSelectedItem(item);
    if (type === "edit") {
      setShowModal(true);
    } else if (type === "print") {
      setShowPrintModal(true);
    } else if (type === "delete") {
      setShowDeleteModal(true);
    }
  };

  const columns = useMemo<ColumnDef<Antrean>[]>(
    () => [
      {
        accessorKey: "noPolisi",
        header: () => <div className="text-left font-black tracking-widest uppercase">Kendaraan</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3 py-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-2 text-dark dark:bg-dark-2 dark:text-white">
                {item.tipe === "Mobil" ? (
                  <Icons.KendaraanMobil size={20} />
                ) : (
                  <Icons.KendaraanMotor size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-dark dark:text-white text-sm">
                  {item.noPolisi}
                </span>
                <span className="text-[10px] font-medium text-dark-5">
                  {item.kendaraan}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "pelanggan",
        header: () => <div className="text-left font-black tracking-widest uppercase">Pelanggan</div>,
        cell: ({ row }) => (
          <div className="flex flex-col py-2">
            <span className="font-bold text-dark dark:text-white text-sm">
              {row.original.pelanggan}
            </span>
            <span className="text-[10px] font-medium text-dark-5 uppercase tracking-wider">
              Customer
            </span>
          </div>
        ),
      },
      {
        accessorKey: "layanan",
        header: () => <div className="text-left font-black tracking-widest uppercase">Layanan</div>,
        cell: ({ row }) => (
          <p className="max-w-[180px] truncate text-xs font-bold text-dark-5" title={row.original.layanan}>
            {row.original.layanan}
          </p>
        ),
      },
      {
        accessorKey: "waktuMasuk",
        header: () => <div className="text-left font-black tracking-widest uppercase text-xs">Masuk</div>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2 tabular-nums text-sm font-bold text-dark-5">
            <Icons.Pending size={14} />
            {dayjs(row.original.waktuMasuk).format("HH:mm")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="w-full text-center font-black tracking-widest uppercase">Status</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge 
              variant={getStatusVariant(row.original.status)} 
              className="min-w-[90px] justify-center px-3 py-1 text-[10px] font-black uppercase"
            >
              {row.original.status}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-right font-black tracking-widest uppercase text-dark dark:text-white">Opsi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-end gap-1.5">
            <ActionButton 
              icon={<Icons.Print size={14} />} 
              variant="secondary" 
              onClick={() => handleAction(row.original, "print")}
              title="Cetak SPK"
            />
            <ActionButton 
              icon={<Icons.Repair size={14} />} 
              variant="secondary" 
              onClick={() => handleAction(row.original, "edit")}
              title="Edit Antrean"
            />
            <ActionButton 
              icon={<Icons.Delete size={14} />} 
              variant="danger" 
              onClick={() => handleAction(row.original, "delete")}
              title="Hapus"
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
        data={data}
        searchable={["noPolisi", "kendaraan", "pelanggan"]}
        searchPlaceholder="Cari no polisi atau pelanggan..."
        title="Daftar Antrean Servis"
        description="Monitoring antrean kendaraan perbaikan hari ini"
        pageSize={10}
      />

      {showModal && (
        <AntreanFormModal
          item={selectedItem}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSave={(data) => {
            console.log("Saving queue:", data);
            setShowModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          title="Hapus Antrean"
          description="Apakah Anda yakin ingin menghapus antrean kendaraan ini dari sistem?"
          itemDisplay={selectedItem?.noPolisi}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={() => {
            console.log("Deleting item:", selectedItem?.id);
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
        />
      )}
      {showPrintModal && selectedItem && (
        <SPKModal
          item={selectedItem}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}
