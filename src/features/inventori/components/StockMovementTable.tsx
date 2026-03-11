"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { StockMovement } from "@/types/stock-movement";
import { Badge } from "@/features/shared";
import { StockMovementForm } from "./StockMovementForm";
import { StockSummary } from "./StockSummary";
import { StockMovementTableSkeleton } from "./StockMovementTableSkeleton";
import { useStockMovements } from "@/hooks/useStockMovements";
import { stockMovementService } from "@/services/stock-movements.service";
import dayjs from "dayjs";
import { Notify } from "@/utils/notify";
import { useIsMobile } from "@/hooks/use-mobile";

export function StockMovementTable() {
  const isMobile = useIsMobile();
  const { data: movements, loading, error, refetch } = useStockMovements();

  const [showMasukForm, setShowMasukForm] = useState(false);
  const [showKeluarForm, setShowKeluarForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (error) {
      Notify.alert("Gagal", `Gagal memuat pergerakan stok: ${error}`, "error");
    }
  }, [error]);

  const handleStockIn = useCallback(async (d: {
    itemId: string;
    quantity: number;
    note: string;
  }) => {
    setIsSaving(true);
    Notify.loading("Mencatat stok masuk...");
    try {
      await stockMovementService.stockIn({
        spare_part_id: Number(d.itemId),
        quantity: d.quantity,
        note: d.note || undefined,
      });
      Notify.toast("Stok masuk berhasil dicatat!", "success", "top");
      setShowMasukForm(false);
      refetch();
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal mencatat stok masuk";
      Notify.alert("Gagal!", errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  }, [refetch]);

  const handleStockOut = useCallback(async (d: {
    itemId: string;
    quantity: number;
    note: string;
  }) => {
    setIsSaving(true);
    Notify.loading("Mencatat stok keluar...");
    try {
      await stockMovementService.stockOut({
        spare_part_id: Number(d.itemId),
        quantity: d.quantity,
        note: d.note || undefined,
      });
      Notify.toast("Stok keluar berhasil dicatat!", "success", "top");
      setShowKeluarForm(false);
      refetch();
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal mencatat stok keluar";
      Notify.alert("Gagal!", errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  }, [refetch]);

  const columns = useMemo<ColumnDef<StockMovement>[]>(
    () => {
      const allColumns: ColumnDef<StockMovement>[] = [
      {
        accessorKey: "createdAt",
        header: "Tanggal",
        cell: ({ row }) => (
          <span className="text-sm font-medium text-dark-5">
            {dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm")}
          </span>
        ),
      },
      {
        accessorKey: "sparePartName",
        header: "Item & SKU",
        cell: ({ row }) => {
          const m = row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-bold leading-tight text-dark dark:text-white">
                {m.sparePartName}
              </p>
              <p className="font-mono text-[10px] uppercase font-bold text-dark-5">{m.sku}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "type",
        header: () => <div className="w-full text-center">Tipe</div>,
        cell: ({ row }) => {
          const t = row.original.type;
          return (
            <div className="flex w-full justify-center">
              <Badge
                variant={
                  t === "masuk"
                    ? "success"
                    : t === "keluar"
                      ? "danger"
                      : "warning"
                }
                outline
                className="py-0.5 text-[10px] font-bold uppercase"
              >
                {t === "masuk"
                  ? "Masuk"
                  : t === "keluar"
                    ? "Keluar"
                    : "Opname"}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "quantityChange",
        header: () => <div className="w-full text-center">Jumlah</div>,
        cell: ({ row }) => {
          const qty = row.original.quantityChange;
          return (
            <div
              className={`flex w-full justify-center text-sm font-black ${qty > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {qty > 0 ? "+" : ""}
              {qty}
            </div>
          );
        },
      },
      {
        accessorKey: "stockAfter",
        header: () => <div className="w-full text-center">Stok Akhir</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center text-sm font-bold text-dark dark:text-white">
            {row.original.stockAfter}
          </div>
        ),
      },
      {
        accessorKey: "note",
        header: "Keterangan",
        cell: ({ row }) => (
          <span className="block max-w-[150px] truncate text-xs font-medium text-dark-5 italic">
            {row.original.note || "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdBy",
        header: "Oleh",
        cell: ({ row }) => (
          <span className="text-xs font-bold text-dark-5">
            {row.original.createdBy}
          </span>
        ),
      },
    ];

    if (isMobile) {
      return allColumns.filter(col => 
        (col as any).accessorKey === "sparePartName" || 
        (col as any).accessorKey === "quantityChange" ||
        (col as any).accessorKey === "type"
      );
    }

    return allColumns;
  },
    [isMobile],
  );

  if (loading) return <StockMovementTableSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <StockSummary movements={movements || []} />

      <DataTable
        columns={columns}
        data={movements || []}
        searchable={["sparePartName", "sku"]}
        searchPlaceholder="Cari nama atau SKU..."
        title="Riwayat Pergerakan Stok"
        description="Log semua riwayat keluar-masuk stok sparepart secara real-time"
        pageSize={10}
        primaryAction={{
          label: "Tambah Stok (Masuk)",
          onClick: () => setShowMasukForm(true),
        }}
        secondaryAction={{
          label: "Kurang Stok (Keluar)",
          onClick: () => setShowKeluarForm(true),
          variant: "danger",
        }}
      />

      {showMasukForm && (
        <StockMovementForm
          type="masuk"
          onClose={() => setShowMasukForm(false)}
          onSave={handleStockIn}
          isLoading={isSaving}
        />
      )}
      {showKeluarForm && (
        <StockMovementForm
          type="keluar"
          onClose={() => setShowKeluarForm(false)}
          onSave={handleStockOut}
          isLoading={isSaving}
        />
      )}
    </div>
  );
}
