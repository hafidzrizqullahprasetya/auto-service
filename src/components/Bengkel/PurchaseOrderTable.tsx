"use client";

import { useState } from "react";
import { MOCK_PURCHASE_ORDERS, PurchaseOrder } from "@/mock/service-history";
import { formatNumber } from "@/lib/format-number";
import { Badge } from "./Badge";
import { Icons } from "@/components/Icons";
import { TableToolbar } from "./TableToolbar";
import { ActionButton } from "./ActionButton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

type POStatus = PurchaseOrder["status"];

function POStatusBadge({ status }: { status: POStatus }) {
  const map: Record<POStatus, "warning" | "primary" | "success" | "danger"> = {
    Draft: "warning",
    Dikirim: "primary",
    Diterima: "success",
    Dibatalkan: "danger",
  };
  return <Badge variant={map[status]}>{status}</Badge>;
}

const STATUS_STEPS: POStatus[] = ["Draft", "Dikirim", "Diterima"];

function POProgressBar({ status }: { status: POStatus }) {
  if (status === "Dibatalkan") {
    return (
      <span className="text-xs text-red font-medium">Dibatalkan</span>
    );
  }
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              i <= currentIdx ? "bg-primary" : "bg-gray-3 dark:bg-dark-3"
            )}
          />
          {i < STATUS_STEPS.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-6",
                i < currentIdx ? "bg-primary" : "bg-gray-3 dark:bg-dark-3"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function PurchaseOrderTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MOCK_PURCHASE_ORDERS.filter(
    (po) =>
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.noPO.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalNilai = MOCK_PURCHASE_ORDERS.filter(
    (po) => po.status !== "Dibatalkan"
  ).reduce((acc, po) => acc + po.totalNilai, 0);

  const draft = MOCK_PURCHASE_ORDERS.filter((po) => po.status === "Draft").length;
  const dikirim = MOCK_PURCHASE_ORDERS.filter((po) => po.status === "Dikirim").length;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total PO Aktif", value: MOCK_PURCHASE_ORDERS.length, icon: Icons.Database, color: "bg-primary/10 text-primary" },
          { label: "Draft", value: draft, icon: Icons.Pending, color: "bg-yellow/10 text-yellow" },
          { label: "Dikirim", value: dikirim, icon: Icons.Antrean, color: "bg-blue-light-1 text-blue-dark" },
          { label: "Total Nilai PO", value: `Rp ${formatNumber(totalNilai)}`, icon: Icons.Cash, color: "bg-green-light-1 text-green" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-dark-3 dark:bg-gray-dark flex items-center gap-3"
          >
            <div className={cn("h-10 w-10 shrink-0 rounded-full flex items-center justify-center", color)}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-black text-base text-dark dark:text-white">{value}</p>
              <p className="text-xs text-dark-5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
        <TableToolbar
          title="Purchase Order (PO) Stok"
          description="Kelola pemesanan dan pembelian stok dari supplier"
          onSearch={setSearchTerm}
          searchPlaceholder="Cari supplier atau nomor PO..."
          primaryAction={{
            label: "Buat PO Baru",
            onClick: () => {},
          }}
          filterActions={
            <ActionButton
              variant="outline"
              label="Export PO"
              icon={<Icons.Print size={16} />}
            />
          }
        />

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead className="font-bold text-left px-4">No. PO / Tanggal</TableHead>
                <TableHead className="font-bold text-left px-4">Supplier</TableHead>
                <TableHead className="font-bold text-center px-4">Status</TableHead>
                <TableHead className="font-bold text-center px-4">Progress</TableHead>
                <TableHead className="font-bold text-left px-4">Total Nilai</TableHead>
                <TableHead className="font-bold text-left px-4">Est. Tiba</TableHead>
                <TableHead className="font-bold text-right pr-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((po) => (
                <>
                  <TableRow
                    key={po.id}
                    className="border-[#eee] dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors group cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === po.id ? null : po.id)
                    }
                  >
                    <TableCell className="px-4">
                      <p className="font-mono text-xs font-bold text-dark dark:text-white bg-gray-2 dark:bg-dark-2 px-2 py-1 rounded w-fit">
                        {po.noPO}
                      </p>
                      <p className="text-xs text-dark-5 mt-1">
                        {dayjs(po.tanggal).format("DD MMM YYYY")}
                      </p>
                    </TableCell>
                    <TableCell className="px-4 font-medium text-dark dark:text-white">
                      {po.supplier}
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <POStatusBadge status={po.status} />
                    </TableCell>
                    <TableCell className="text-center px-4">
                      <POProgressBar status={po.status} />
                    </TableCell>
                    <TableCell className="px-4">
                      <p className="font-black text-secondary">
                        Rp {formatNumber(po.totalNilai)}
                      </p>
                    </TableCell>
                    <TableCell className="px-4">
                      <p className="text-sm text-dark dark:text-white">
                        {po.estimasiTiba
                          ? dayjs(po.estimasiTiba).format("DD MMM YYYY")
                          : "—"}
                      </p>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ActionButton variant="primary" label="Detail" />
                        <ActionButton variant="danger" icon={<Icons.Delete size={14} />} />
                      </div>
                    </TableCell>
                  </TableRow>

                  {expandedId === po.id && (
                    <TableRow key={`${po.id}-detail`} className="bg-gray-1 dark:bg-dark-2">
                      <TableCell colSpan={7} className="px-6 py-3">
                        <div className="grid gap-2">
                          {po.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <div>
                                <span className="font-mono text-xs bg-gray-2 dark:bg-dark-3 px-1.5 py-0.5 rounded mr-2">
                                  {item.sku}
                                </span>
                                <span className="text-dark dark:text-white">
                                  {item.nama}
                                </span>
                                <span className="text-dark-5 ml-2">× {item.qty}</span>
                              </div>
                              <span className="font-semibold text-dark dark:text-white">
                                Rp {formatNumber(item.hargaSatuan * item.qty)}
                              </span>
                            </div>
                          ))}
                          {po.catatan && (
                            <p className="text-xs text-dark-5 mt-1 italic">
                              📝 {po.catatan}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
