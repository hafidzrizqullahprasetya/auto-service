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
import { Notify } from "@/utils/notify";
import { QueueFormModal } from "./QueueFormModal";
import { SPKModal } from "./SPKModal";
import { InspectionChecklistModal } from "./InspectionChecklistModal";
import { antreanToExcelRows } from "@/lib/excel";
import { useAuth } from "@/hooks/useAuth";

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
  onPay: (item: Antrean) => void;
  isLoading?: boolean;
}

export function QueueTable({ data, onUpdate, onDelete, onPay, isLoading = false }: QueueTableProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Antrean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const authUser = useAuth();
  const canManageInspection = authUser?.role === "Owner" || authUser?.role === "Admin";

  const handleAction = (item: Antrean, type: "print" | "edit" | "delete" | "inspection") => {
    setSelectedItem(item);
    if (type === "edit") {
      setShowModal(true);
    } else if (type === "print") {
      setShowPrintModal(true);
    } else if (type === "inspection") {
      setShowInspectionModal(true);
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
                  {item.kendaraan || "-"}
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
              {row.original.pelanggan || "-"}
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
              {row.original.layanan || "-"}
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
        accessorKey: "payment_status",
        header: () => <div className="w-full text-center">Pembayaran</div>,
        cell: ({ row }) => {
          const status = row.original.payment_status;
          return (
            <div className="flex w-full justify-center">
              <Badge
                variant={status === "Lunas" ? "success" : status === "Piutang" ? "warning" : "neutral"}
                className="min-w-[96px] justify-center whitespace-nowrap px-3 py-1 text-[10px] font-black uppercase tracking-wider"
              >
                {status || "Belum Bayar"}
              </Badge>
            </div>
          );
        },
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
                onClick={async () => {
                  const item = row.original;
                  const confirmed = await Notify.confirm(
                    "Kirim Progres?",
                    `Kirim update status "${item.status}" ke ${item.pelanggan} via WhatsApp?`,
                  );

                  if (!confirmed) return;

                  Notify.loading("Mengirim progres...");
                    
                    const message = `
*Update Progres Servis - AutoService* 🛠️

Halo Bapak/Ibu *${item.pelanggan}*,
Kendaraan Anda dengan plat nomor *${item.noPolisi}* (${item.kendaraan}) saat ini:

🚩 *STATUS: ${item.status.toUpperCase()}*

*Detail:*
Layanan: ${item.layanan}
Mekanik: ${item.mekanik || "-"}
Estimasi: ${item.estimasiSelesai || "-"}

Kami akan mengabari kembali jika pengerjaan telah selesai. Terima kasih atas kepercayaan Anda. 🙏
`.trim();

                    const phoneNumber = item.waPelanggan!.startsWith("+")
                      ? item.waPelanggan!
                      : `+62${item.waPelanggan!.startsWith("0") ? item.waPelanggan!.slice(1) : item.waPelanggan!}`;

                    try {
                    const { api } = await import("@/lib/api");
                    await api.post("/api/v1/notifications/wa/send", {
                      phone: phoneNumber,
                      message: message,
                    });

                    Notify.toast("Update progres berhasil dikirim!", "success");
                  } catch (error: any) {
                    Notify.alert("Gagal Kirim", error.message || "Gagal mengirim progres via WA", "error");
                  } finally {
                    Notify.close();
                  }
                }}
                title="WhatsApp Progres"
              />
            )}
            <ActionButton
              icon={<Icons.Print size={16} />}
              variant="view"
              onClick={() => handleAction(row.original, "print")}
              title="Cetak SPK"
            />
            {canManageInspection && (
              <ActionButton
                icon={<Icons.StockOpname size={16} />}
                variant="success"
                onClick={() => handleAction(row.original, "inspection")}
                title="Checklist Inspeksi"
              />
            )}
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
            <ActionButton
              icon={<Icons.Kasir size={16} />}
              variant="primary"
              onClick={async () => {
                if (row.original.payment_status === "Lunas") {
                  Notify.toast("Transaksi ini sudah lunas", "success");
                  return;
                }
                Notify.loading("Menyiapkan Kasir...");
                onPay(row.original);
              }}
              title={row.original.payment_status === "Lunas" ? "Sudah Lunas" : "Bayar / Ke Kasir"}
              disabled={row.original.payment_status === "Lunas"}
            />
          </div>
        ),
      },
    ];

    return allColumns;
  }, [canManageInspection]);

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

      {showInspectionModal && selectedItem && (
        <InspectionChecklistModal
          item={selectedItem}
          onClose={() => {
            setShowInspectionModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
}

export { QueueTable as AntreanTable };
