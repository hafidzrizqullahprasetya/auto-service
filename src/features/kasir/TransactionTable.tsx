"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Transaction } from "@/types/transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";
import { InvoiceModal } from "@/features/kasir";
import { ActionButton } from "@/features/shared";

export function TransactionTable() {
  const { data: transactions, loading } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "invoiceNo",
        header: "No. Invoice",
        cell: ({ row }) => (
          <span className="text-sm font-bold text-dark dark:text-white">
            {row.original.invoiceNo}
          </span>
        ),
      },
      {
        accessorKey: "date",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-dark-5">
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
            <div className="flex flex-col">
              <p className="font-bold text-dark dark:text-white">
                {tx.customerName}
              </p>
              <span className="text-[10px] font-medium text-dark-5">
                {tx.vehiclePlate}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: () => <div className="w-full text-center">Tipe</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <Badge
              variant={row.original.type === "Service" ? "primary" : "info"}
              className="text-[10px]"
            >
              {row.original.type}
            </Badge>
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: "Total Bayar",
        cell: ({ row }) => {
          const tx = row.original;
          return (
            <div>
              <p className="font-bold text-dark dark:text-white">
                Rp {formatNumber(tx.total)}
              </p>
              {tx.paymentStatus === "DP" && tx.dpAmount && (
                <p className="text-[10px] text-dark-5">
                  DP: Rp {formatNumber(tx.dpAmount)} · Sisa: Rp{" "}
                  {formatNumber(tx.total - tx.dpAmount)}
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
              className="text-[10px]"
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
            <div className="flex w-full items-center justify-center gap-1.5 text-xs font-bold text-dark dark:text-white">
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
    ],
    [],
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
