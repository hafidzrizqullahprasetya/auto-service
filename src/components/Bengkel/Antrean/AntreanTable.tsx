"use client";

import React, { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Antrean } from "@/mock/antrean";
import {
  ActionButton,
  Badge,
  ConfirmDeleteModal,
  ExcelButtons,
} from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { AntreanFormModal } from "./AntreanFormModal";
import { SPKModal } from "./SPKModal";
import dayjs from "dayjs";
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
        header: "Kendaraan",
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
                <span className="flex items-center gap-2 text-sm font-bold text-dark dark:text-white">
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
        header: "Pelanggan",
        cell: ({ row }) => (
          <div className="flex flex-col py-2">
            <span className="text-sm font-bold text-dark dark:text-white">
              {row.original.pelanggan}
            </span>
            {row.original.waPelanggan ? (
              <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-dark-5">
                <Icons.Whatsapp size={10} className="text-[#25D366]" />
                {row.original.waPelanggan}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-dark-5">
                Customer
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
            <p
              className="max-w-[200px] truncate text-xs font-bold text-dark"
              title={row.original.layanan}
            >
              {row.original.layanan}
            </p>
            {row.original.keluhan && (
              <p
                className="max-w-[200px] truncate text-[10px] text-dark-5"
                title={row.original.keluhan}
              >
                "{row.original.keluhan}"
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: "waktuMasuk",
        header: "Masuk",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-sm font-bold tabular-nums text-dark-5">
            <Icons.Pending size={14} />
            {dayjs(row.original.waktuMasuk).format("HH:mm")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: () => <div className="w-full text-center">Status</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={
                row.original.menginap
                  ? "danger"
                  : getStatusVariant(row.original.status)
              }
              className="min-w-[90px] justify-center px-3 py-1 text-[10px] font-bold"
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
                onClick={() => {
                  alert(
                    `Mengirim notifikasi progres WhatsApp ke ${row.original.waPelanggan}...`,
                  );
                }}
                title="Kirim Update WA"
              />
            )}
            <ActionButton
              icon={<Icons.Print size={16} />}
              variant="view"
              onClick={() => handleAction(row.original, "print")}
              title="Cetak Estimasi/SPK"
            />
            <ActionButton
              icon={<Icons.Repair size={16} />}
              variant="edit"
              onClick={() => handleAction(row.original, "edit")}
              title="Edit Antrean"
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
    ],
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchable={["noPolisi", "kendaraan", "pelanggan", "keluhan"]}
        searchPlaceholder="Cari plat, pelanggan, atau keluhan..."
        title="Daftar Penerimaan & Antrean"
        description="Pencatatan awal kendaraan masuk, keluhan, estimasi, dan daftar tunggu"
        pageSize={5}
        extraActions={
          <ExcelButtons
            moduleKey="antrean"
            exportData={antreanToExcelRows(data)}
            onImport={(rows) => console.log("Import antrean:", rows)}
          />
        }
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
