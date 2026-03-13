"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Antrean } from "@/types/antrean";
import {
  ActionButton,
  Badge,
  ConfirmDeleteModal,
  ExcelButtons,
} from "@/features/shared";
import { Icons } from "@/components/Icons";
import { QueueFormModal } from "./QueueFormModal";
import { SPKModal } from "./SPKModal";
import { antreanToExcelRows } from "@/lib/excel";

const getStatusVariant = (status: Antrean["status"]) => {
  switch (status) {
    case "Selesai":
      return "success" as const;
    case "Menunggu":
      return "danger" as const;
    case "Dikerjakan":
      return "info" as const;
    case "Menunggu Sparepart":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
};

interface QueueTableProps {
  data: Antrean[];
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function QueueTable({ data, onUpdate, onDelete, isLoading = false }: QueueTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Antrean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const columns = useMemo<ColumnDef<Antrean>[]>(() => {
    const allColumns: ColumnDef<Antrean>[] = [
      {
        accessorKey: "noPolisi",
        header: "Kendaraan",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-3 py-1">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-2 text-dark dark:bg-dark-2 dark:text-white">
                {item.tipe === "Mobil" ? (
                  <Icons.KendaraanMobil size={20} />
                ) : (
                  <Icons.KendaraanMotor size={20} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-sm font-black uppercase text-dark dark:text-white">
                  {item.noPolisi}
                </span>
                <span className="text-[10px] font-bold uppercase text-dark-5">
                  {item.kendaraan}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "pelanggan",
        header: "Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-dark dark:text-white">
              {row.original.pelanggan}
            </span>
            {row.original.waPelanggan && (
              <span className="flex items-center gap-1 text-[10px] font-black text-dark-5">
                <Icons.Whatsapp size={10} className="text-[#25D366]" />
                {row.original.waPelanggan}
              </span>
            )}
          </div>
        ),
      },
      {
        accessorKey: "layanan",
        header: "Keluhan & Layanan",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <p className="max-w-[180px] truncate text-sm font-bold text-dark dark:text-white text-dark dark:text-white">
              {row.original.layanan}
            </p>
            {row.original.keluhan && (
              <p className="max-w-[180px] truncate text-xs italic text-dark-5">
                "{row.original.keluhan}"
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="w-full text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={row.original.menginap ? "danger" : getStatusVariant(row.original.status)}
              outline
              className="py-0.5 text-[10px] font-black uppercase tracking-wider"
            >
              {row.original.menginap ? "Menginap" : row.original.status}
            </Badge>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Opsi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-1.5">
            {row.original.waPelanggan && (
              <ActionButton
                icon={<Icons.Whatsapp size={16} />}
                variant="success"
                onClick={() => alert(`Mengirim progres ke ${row.original.waPelanggan}...`)}
                title="WhatsApp Progres"
              />
            )}
            <ActionButton
              icon={<Icons.Print size={16} />}
              variant="view"
              onClick={() => handleAction(row.original, "print")}
              title="Cetak SPK"
            />
            <ActionButton
              icon={<Icons.Repair size={16} />}
              variant="edit"
              onClick={() => handleAction(row.original, "edit")}
              title="Edit"
            />
            <ActionButton
              icon={<Icons.Delete size={16} />}
              variant="delete"
              onClick={() => handleAction(row.original, "delete")}
              title="Hapus"
            />
          </div>
        ),
      },
    ];

    return allColumns;
  }, []);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchable={["noPolisi", "kendaraan", "pelanggan", "layanan"]}
        searchPlaceholder="Cari plat, pelanggan, atau layanan..."
        title="Daftar Antrean Servis"
        description="Monitor progres pengerjaan kendaraan secara real-time"
        pageSize={5}
        isLoading={isLoading}
        extraActions={
          <ExcelButtons
            moduleKey="antrean"
            exportData={antreanToExcelRows(data) as any}
          />
        }
      />

      {showModal && (
        <QueueFormModal
          item={selectedItem}
          isLoading={isSaving}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSave={async (formData) => {
            if (!selectedItem) return;
            setIsSaving(true);
            try {
              await onUpdate(selectedItem.id, formData);
              setShowModal(false);
              setSelectedItem(null);
            } finally {
              setIsSaving(false);
            }
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmDeleteModal
          title="Hapus Antrean"
          description="Hapus antrean kendaraan dari daftar pengerjaan?"
          itemDisplay={selectedItem?.noPolisi}
          isLoading={isDeleting}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={async () => {
            if (!selectedItem) return;
            setIsDeleting(true);
            try {
              await onDelete(selectedItem.id);
              setShowDeleteModal(false);
              setSelectedItem(null);
            } finally {
              setIsDeleting(false);
            }
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

export { QueueTable as AntreanTable };
