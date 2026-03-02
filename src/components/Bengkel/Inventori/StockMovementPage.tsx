"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { MOCK_STOCK_MOVEMENTS, StockMovement } from "@/mock/stock-movements";
import { Badge } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { StockMovementForm } from "./StockMovementForm";
import dayjs from "dayjs";

// ─── Summary mini-cards ────────────────────────────────────────────────────────
function StockSummary({ movements }: { movements: StockMovement[] }) {
  const totalMasuk = movements.filter((m) => m.type === "masuk").reduce((s, m) => s + m.quantityChange, 0);
  const totalKeluar = movements.filter((m) => m.type === "keluar").reduce((s, m) => s + Math.abs(m.quantityChange), 0);
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {[
        { label: "Total Masuk", value: totalMasuk, sub: "unit masuk", icon: <Icons.ArrowUp size={20} /> },
        { label: "Total Keluar", value: totalKeluar, sub: "unit keluar", icon: <Icons.ArrowDown size={20} /> },
        { label: "Total Transaksi", value: movements.length, sub: "entri log", icon: <Icons.History size={20} /> },
      ].map(({ label, value, sub, icon }) => (
        <div key={label} className="rounded-[10px] border border-stroke bg-white p-5 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-2 text-primary dark:bg-dark-3">
              {icon}
            </div>
            <div>
              <h4 className="text-xl font-black text-dark dark:text-white leading-none">{value}</h4>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dark-5">{label}</p>
              <p className="text-[9px] uppercase font-medium text-dark-6 tracking-wider">{sub}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StockMovementPage() {
  const [showMasukForm, setShowMasukForm] = useState(false);
  const [showKeluarForm, setShowKeluarForm] = useState(false);

  const columns = useMemo<ColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm text-dark-5">
            {dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm")}
          </span>
        ),
      },
      {
        accessorKey: "sparePartName",
        header: "Item",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div>
              <p className="font-bold text-sm text-dark dark:text-white">{m.sparePartName}</p>
              <p className="font-mono text-[10px] text-dark-5">{m.sku}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: () => <div className="text-center">Tipe</div>,
        cell: ({ row }) => {
          const t = row.original.type;
          return (
            <div className="flex justify-center">
              <Badge
                variant={t === "masuk" ? "success" : t === "keluar" ? "danger" : "warning"}
                className="text-[10px]"
              >
                {t === "masuk" ? "Masuk" : t === "keluar" ? "Keluar" : "Opname Adj"}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "quantityChange",
        header: () => <div className="text-center">Jumlah</div>,
        cell: ({ row }) => {
          const qty = row.original.quantityChange;
          return (
            <div className={`text-center font-black text-sm ${qty > 0 ? "text-green-600" : "text-red-500"}`}>
              {qty > 0 ? "+" : ""}{qty}
            </div>
          );
        },
      },
      {
        accessorKey: "stockBefore",
        header: () => <div className="text-center">Stok Sebelum</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm font-medium text-dark-5">{row.original.stockBefore}</div>
        ),
      },
      {
        accessorKey: "stockAfter",
        header: () => <div className="text-center">Stok Sesudah</div>,
        cell: ({ row }) => (
          <div className="text-center text-sm font-bold text-dark dark:text-white">{row.original.stockAfter}</div>
        ),
      },
      {
        accessorKey: "note",
        header: "Catatan",
        cell: ({ row }) => (
          <span className="text-sm text-dark-5 max-w-[180px] truncate block">
            {row.original.note || "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdBy",
        header: "Oleh",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-dark-5">{row.original.createdBy}</span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <StockSummary movements={MOCK_STOCK_MOVEMENTS} />

      <DataTable
        columns={columns}
        data={MOCK_STOCK_MOVEMENTS}
        searchable={["sparePartName", "sku"]}
        searchPlaceholder="Cari nama atau SKU..."
        title="Riwayat Pergerakan Stok"
        description="Log semua keluar-masuk stok sparepart"
        primaryAction={{
          label: "Stok Masuk",
          onClick: () => setShowMasukForm(true),
        }}
        secondaryAction={{
          label: "Stok Keluar",
          onClick: () => setShowKeluarForm(true),
          variant: "danger",
        }}
      />

      {showMasukForm && (
        <StockMovementForm
          type="masuk"
          onClose={() => setShowMasukForm(false)}
          onSave={(d) => { console.log("Stok Masuk:", d); setShowMasukForm(false); }}
        />
      )}
      {showKeluarForm && (
        <StockMovementForm
          type="keluar"
          onClose={() => setShowKeluarForm(false)}
          onSave={(d) => { console.log("Stok Keluar:", d); setShowKeluarForm(false); }}
        />
      )}
    </div>
  );
}
