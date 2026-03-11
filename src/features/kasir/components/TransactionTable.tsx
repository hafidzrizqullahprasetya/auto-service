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
import { ActionButton, BaseModal } from "@/features/shared";
import { useIsMobile } from "@/hooks/use-mobile";

export function TransactionTable() {
  const isMobile = useIsMobile();
  const { data: transactions, loading } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => {
      const allColumns: ColumnDef<Transaction>[] = [
      {
        accessorKey: "invoiceNo",
        header: "No. Invoice",
        cell: ({ row }) => (
          <span className="font-mono text-sm font-black uppercase text-dark dark:text-white">
            {row.original.invoiceNo}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm font-bold text-dark-5">
            {dayjs(row.original.date).format("DD/MM/YYYY")}
          </span>
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
        header: () => <div className="w-full text-right">Total Bayar</div>,
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div className="flex flex-col items-end">
              <p className="text-sm font-black text-secondary">
                Rp {formatNumber(tx.total)}
              </p>
              {tx.paymentStatus === "DP" && tx.dpAmount && (
                <p className="text-[10px] font-bold text-warning">
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
          <div className="flex w-full items-center justify-center">
            <ActionButton
              onClick={() => setSelectedTx(row.original)}
              variant="view"
              icon={<Icons.Print size={16} />}
              title="Lihat Invoice"
            />
          </div>
        ),
      },
    ];

    if (isMobile) {
        return allColumns.filter(col => 
          (col as any).accessorKey === "customerName" || 
          (col as any).accessorKey === "total" ||
          col.id === "actions"
        );
      }
  
      return allColumns;
    },
    [isMobile],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={transactions || []}
        isLoading={loading}
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
