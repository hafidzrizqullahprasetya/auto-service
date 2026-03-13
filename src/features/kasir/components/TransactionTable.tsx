"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Transaction } from "@/types/transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNumber } from "@/utils/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";
import { InvoiceModal } from "@/features/kasir";
import { ActionButton } from "@/features/shared";
import { TransactionTableSkeleton } from "./TransactionTableSkeleton";
import { Notify } from "@/utils/notify";

export function TransactionTable() {
  const { data: transactions, loading, deleteTransaction } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "invoiceNo",
        header: () => <div className="w-full text-center">No. Invoice</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <span className="font-mono text-xs font-black uppercase text-dark dark:text-white bg-gray-1 dark:bg-dark-3 px-2 py-1 rounded">
              {row.original.invoiceNo}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: () => <div className="w-full text-center">Tanggal</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <span className="text-sm font-bold text-dark-5 tabular-nums">
              {dayjs(row.original.date).format("DD/MM/YYYY")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "customerName",
        header: "Pelanggan",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold leading-tight text-dark dark:text-white">
                {tx.customerName}
              </p>
              <span className="text-[10px] font-black uppercase text-dark-5">
                {tx.vehiclePlate}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "total",
        header: () => <div className="w-full text-center">Total Bayar</div>,
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col items-center">
              <p className="text-sm font-black text-secondary tabular-nums">
                Rp {formatNumber(tx.total)}
              </p>
              {tx.paymentStatus === "DP" && tx.dpAmount && (
                <p className="text-[10px] font-bold text-warning tabular-nums">
                  Sisa: Rp {formatNumber(tx.total - tx.dpAmount)}
                </p>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "paymentStatus",
        header: () => <div className="w-full text-center">Status</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={
                row.original.paymentStatus === "Lunas"
                  ? "success"
                  : row.original.paymentStatus === "DP"
                    ? "warning"
                    : "danger"
              }
              outline
              className="py-0.5 text-[10px] font-black uppercase tracking-wider"
            >
              {row.original.paymentStatus}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: () => <div className="w-full text-center">Metode</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => {
          const m = row.original.paymentMethod;
          return (
            <div className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-dark-5 dark:text-dark-6">
              {m === "Cash" && <Icons.Cash size={14} />}
              {m === "Transfer" && <Icons.Database size={14} />}
              {m === "E-Wallet" && <Icons.EWallet size={14} />}
              {m === "Card" && <Icons.Card size={14} />}
              {m}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Opsi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-1">
            <ActionButton
              onClick={() => setSelectedTx(row.original)}
              variant="view"
              icon={<Icons.Print size={16} />}
              title="Lihat Invoice"
            />
            {row.original.customerPhone && (
              <ActionButton
                variant="success"
                icon={<Icons.Whatsapp size={16} />}
                onClick={async () => {
                  const tx = row.original;
                  const confirmed = await Notify.confirm(
                    "Kirim Invoice?",
                    `Kirim invoice ${tx.invoiceNo} ke ${tx.customerName} via WhatsApp?`
                  );
                  if (!confirmed) return;

                  try {
                    Notify.loading("Mengirim invoice...");
                    
                    // Format message (reuse logic or keep simple)
                    const itemsList = tx.items
                      .map(i => `• ${i.name} (x${i.qty})`)
                      .join("\n");
                    
                    const message = `
*NOTA SERVIS* 📋
No: ${tx.invoiceNo}
Pelanggan: ${tx.customerName}
Total: Rp ${formatNumber(tx.total)}
Status: ${tx.paymentStatus}

Detail:
${itemsList}

Terima kasih! 🙏
`.trim();

                    const phoneNumber = tx.customerPhone!.startsWith("+")
                      ? tx.customerPhone!
                      : `+62${tx.customerPhone!.startsWith("0") ? tx.customerPhone!.slice(1) : tx.customerPhone!}`;

                    const { api } = await import("@/lib/api");
                    await api.post("/api/v1/notifications/wa/send", {
                      phone: phoneNumber,
                      message: message,
                    });

                    Notify.toast("Invoice dikirim!", "success");
                  } catch (err: any) {
                    Notify.alert("Gagal!", err.message);
                  } finally {
                    Notify.close();
                  }
                }}
                title="Kirim WA"
              />
            )}
            <ActionButton
              onClick={async () => {
                const isConfirmed = await Notify.confirm(
                  "Hapus Transaksi?",
                  `Transaksi ${row.original.invoiceNo} akan dihapus permanen.`,
                  "Ya, Hapus"
                );
                if (isConfirmed) {
                  try {
                    Notify.loading("Menghapus...");
                    await deleteTransaction(row.original.id);
                    Notify.toast("Transaksi dihapus", "success");
                  } catch (err: any) {
                    Notify.alert("Gagal!", err.message || "Gagal menghapus");
                  } finally {
                    Notify.close();
                  }
                }
              }}
              variant="delete"
              icon={<Icons.Delete size={16} />}
              title="Hapus Transaksi"
            />
          </div>
        ),
      },
    ],
    [],
  );

  if (loading) return <TransactionTableSkeleton />;

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions || []}
        searchable={["invoiceNo", "customerName", "vehiclePlate"]}
        searchPlaceholder="Cari invoice atau pelanggan..."
        title="Riwayat Transaksi Keuangan"
        description="Log pembayaran servis dan sparepart secara real-time"
        pageSize={5}
      />

      {selectedTx && (
        <InvoiceModal
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </>
  );
}
