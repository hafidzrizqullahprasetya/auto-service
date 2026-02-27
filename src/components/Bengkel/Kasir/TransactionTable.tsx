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
import { MOCK_TRANSACTIONS, Transaction } from "@/mock/transactions";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import dayjs from "dayjs";
import { InvoiceModal } from "@/components/Bengkel/Kasir";
import { ActionButton } from "@/components/Bengkel/shared";
import { TableToolbar } from "@/components/Bengkel/shared";

export function TransactionTable() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => 
      tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
      <TableToolbar 
        title="Riwayat Transaksi Keuangan"
        description="Log pembayaran servis dan sparepart secara real-time"
        onSearch={setSearchTerm}
        searchPlaceholder="Cari invoice atau pelanggan..."
        primaryAction={{
          label: "Eksport Laporan",
          onClick: () => console.log("Export report"),
          icon: <Icons.Print size={16} />,
        }}
      />

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="font-bold text-left px-4">No. Invoice</TableHead>
              <TableHead className="font-bold text-left px-4">Tanggal</TableHead>
              <TableHead className="min-w-[150px] font-bold text-left px-4">Pelanggan</TableHead>
              <TableHead className="font-bold text-center px-4">Tipe</TableHead>
              <TableHead className="font-bold text-left px-4">Total Bayar</TableHead>
              <TableHead className="font-bold text-center px-4">Status</TableHead>
              <TableHead className="font-bold text-center px-4">Metode</TableHead>
              <TableHead className="text-right font-bold pr-4">Opsi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((tx) => (
                <TableRow key={tx.id} className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group">
                  <TableCell className="px-4">
                    <span className="font-bold text-dark dark:text-white text-sm">
                      {tx.invoiceNo}
                    </span>
                  </TableCell>
                  
                  <TableCell className="px-4">
                    <span className="text-sm font-medium text-dark-5 dark:text-dark-6">
                      {dayjs(tx.date).format("DD/MM/YYYY")}
                    </span>
                  </TableCell>

                  <TableCell className="px-4">
                    <div className="flex flex-col">
                      <p className="font-bold text-dark dark:text-white">{tx.customerName}</p>
                      <span className="text-[10px] font-bold text-secondary uppercase italic">{tx.vehiclePlate}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <Badge variant={tx.type === "Service" ? "primary" : "info"} className="text-[10px]">
                      {tx.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4">
                    <p className="font-black text-dark dark:text-white">Rp {formatNumber(tx.total)}</p>
                    {tx.paymentStatus === "DP" && tx.dpAmount && (
                      <p className="text-[10px] text-dark-5">DP: Rp {formatNumber(tx.dpAmount)} · Sisa: Rp {formatNumber(tx.total - tx.dpAmount)}</p>
                    )}
                  </TableCell>

                  <TableCell className="text-center px-4">
                    <Badge variant={
                      tx.paymentStatus === "Lunas" ? "success" 
                      : tx.paymentStatus === "DP" ? "warning" 
                      : "danger"
                    } className="text-[10px]">
                      {tx.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center px-4">
                     <div className="flex items-center justify-center gap-2 text-xs font-bold text-dark dark:text-white">
                       {tx.paymentMethod === "Cash" && <Icons.Cash size={14} className="text-green" />}
                       {tx.paymentMethod === "Transfer" && <Icons.Database size={14} className="text-blue" />}
                       {tx.paymentMethod === "E-Wallet" && <Icons.Kasir size={14} className="text-purple-500" />}
                       {tx.paymentMethod === "Card" && <Icons.Card size={14} className="text-secondary" />}
                       {tx.paymentMethod}
                     </div>
                  </TableCell>

                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton 
                        onClick={() => setSelectedTx(tx)}
                        variant="secondary"
                        icon={<Icons.Print size={18} />}
                        title="Lihat Invoice"
                      />
                    </div>
                  </TableCell>
                </TableRow>
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

      {selectedTx && (
        <InvoiceModal 
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
}

