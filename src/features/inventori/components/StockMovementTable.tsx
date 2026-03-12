"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
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
import { formatNumber } from "@/utils/format-number";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";

export function StockMovementTable() {
  const { data: movements, loading, error, refetch } = useStockMovements();

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [showMasukForm, setShowMasukForm] = useState(false);
  const [showKeluarForm, setShowKeluarForm] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<StockMovement | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const modalParam = searchParams.get("modal");

  useEffect(() => {
    setShowMasukForm(modalParam === "stock-in");
    setShowKeluarForm(modalParam === "stock-out");
  }, [modalParam]);

  const updateModalUrl = (type: "stock-in" | "stock-out" | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("modal", type);
    else params.delete("modal");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
    () => [
      {
        accessorKey: "createdAt",
        header: "Tanggal",
        meta: { hiddenOnMobile: true },
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
        meta: { hiddenOnMobile: true },
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
              {formatNumber(qty)}
            </div>
          );
        },
      },
      {
        accessorKey: "stockAfter",
        header: () => <div className="w-full text-center">Stok Akhir</div>,
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <div className="flex w-full justify-center text-sm font-bold text-dark dark:text-white">
            {formatNumber(row.original.stockAfter)}
          </div>
        ),
      },
      {
        accessorKey: "note",
        header: "Keterangan",
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <span className="block max-w-[150px] truncate text-xs font-medium text-dark-5 italic">
            {row.original.note || "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdBy",
        header: "Oleh",
        meta: { hiddenOnMobile: true },
        cell: ({ row }) => (
          <span className="text-xs font-bold text-dark-5">
            {row.original.createdBy}
          </span>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Aksi</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center">
            <ActionButton
              variant="view"
              icon={<Icons.Eye size={16} />}
              title="Lihat Detail"
              onClick={() => setSelectedDetail(row.original)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  if (loading) return <StockMovementTableSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden sm:block">
        <StockSummary movements={movements || []} />
      </div>

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
          onClick: () => updateModalUrl("stock-in"),
        }}
        secondaryAction={{
          label: "Kurang Stok (Keluar)",
          onClick: () => updateModalUrl("stock-out"),
          variant: "danger",
        }}
      />

      {showMasukForm && (
        <StockMovementForm
          type="masuk"
          onClose={() => updateModalUrl(null)}
          onSave={handleStockIn}
          isLoading={isSaving}
        />
      )}
      {showKeluarForm && (
        <StockMovementForm
          type="keluar"
          onClose={() => updateModalUrl(null)}
          onSave={handleStockOut}
          isLoading={isSaving}
        />
      )}

      {selectedDetail && (
        <BaseModal
          title="Detail Pergerakan Stok"
          description="Informasi lengkap mengenai transaksi stok ini"
          icon={<Icons.History size={20} />}
          onClose={() => setSelectedDetail(null)}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-bold uppercase tracking-wider text-dark-5">Item</p>
              <p className="text-sm font-black text-dark dark:text-white mt-1">{selectedDetail.sparePartName}</p>
              <p className="font-mono text-[10px] text-dark-5 mt-0.5">{selectedDetail.sku}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
                <p className="text-xs font-bold uppercase tracking-wider text-dark-5">Tipe</p>
                <div className="mt-1">
                  <Badge 
                    variant={selectedDetail.type === 'masuk' ? 'success' : selectedDetail.type === 'keluar' ? 'danger' : 'warning'}
                    outline
                  >
                    {selectedDetail.type}
                  </Badge>
                </div>
              </div>
              <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
                <p className="text-xs font-bold uppercase tracking-wider text-dark-5">Jumlah</p>
                <p className={cn(
                  "text-lg font-black mt-1",
                  selectedDetail.quantityChange > 0 ? "text-green-600" : "text-red-500"
                )}>
                  {selectedDetail.quantityChange > 0 ? "+" : ""}{formatNumber(selectedDetail.quantityChange)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-bold uppercase tracking-wider text-dark-5">Keterangan</p>
              <p className="text-sm font-medium text-dark dark:text-white mt-1 italic italic">
                {selectedDetail.note || "Tidak ada catatan"}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-dark-5 px-1 font-bold">
              <span>Oleh: {selectedDetail.createdBy}</span>
              <span>{dayjs(selectedDetail.createdAt).format("DD MMMM YYYY HH:mm")}</span>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  );
}
