"use client";

import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useMemo } from "react";
import { BaseModal, ActionButton, Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { useInventory } from "@/hooks/useInventory";
import { Item } from "@/types/inventory";
import InputGroup from "@/components/ui/InputGroup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const movementSchema = z.object({
  itemId: z.string().min(1, "Item wajib dipilih"),
  quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
  note: z.string().optional(),
});

type MovementFormValues = z.infer<typeof movementSchema>;
type MovementType = "masuk" | "keluar";

interface StockMovementFormProps {
  type: MovementType;
  onClose: () => void;
  onSave: (data: { itemId: string; quantity: number; note: string }) => void;
  preselectedItem?: Item | null;
  isLoading?: boolean;
}

export function StockMovementForm({
  type,
  onClose,
  onSave,
  preselectedItem,
  isLoading = false,
}: StockMovementFormProps) {
  const { data: inventoryItems, loading: listLoading } = useInventory();
  const [search, setSearch] = useState("");
  const isKeluar = type === "keluar";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema) as any,
    defaultValues: {
      itemId: preselectedItem?.id ?? "",
      quantity: 1,
      note: "",
    },
  });

  const selectedItemId = watch("itemId");
  const quantity = watch("quantity");
  const selectedItem = useMemo(
    () => inventoryItems.find((i) => i.id === selectedItemId),
    [inventoryItems, selectedItemId]
  );

  const physicalItems = useMemo(
    () => inventoryItems.filter((i) => i.category !== "Service"),
    [inventoryItems]
  );

  const filtered = useMemo(
    () =>
      physicalItems.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.sku.toLowerCase().includes(search.toLowerCase())
      ),
    [physicalItems, search]
  );

  const hasEnoughStock = !isKeluar || !selectedItem || (selectedItem.stock ?? 0) >= quantity;

  const onFormSubmit: SubmitHandler<MovementFormValues> = (data) => {
    if (!hasEnoughStock) return;
    onSave(data as any);
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  return (
    <BaseModal
      title={isKeluar ? "Catat Stok Keluar" : "Catat Stok Masuk"}
      description={
        isKeluar
          ? "Kurangi stok karena pemakaian atau pengeluaran manual"
          : "Tambah stok karena restock dari supplier"
      }
      icon={isKeluar ? <Icons.Logout size={20} /> : <Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="md"
      hideFooter
    >
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid) as any} 
        noValidate
        className="space-y-5"
      >
        {/* Pilih Item */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">
            Pilih Item <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
            <input
              type="text"
              placeholder="Cari SKU atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg border-2 border-stroke bg-white py-2.5 pl-9 pr-4 text-sm font-medium outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
                errors.itemId && "border-red-500 focus:border-red-500"
              )}
            />
          </div>
          <div className={cn(
            "max-h-48 overflow-y-auto rounded-xl border-2 border-stroke bg-white dark:border-dark-3 dark:bg-dark-2",
            errors.itemId && "border-red-500/50"
          )}>
            {listLoading ? (
              <div className="p-3 space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={32} borderRadius={8} />
                ))}
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setValue("itemId", item.id);
                    setSearch("");
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-all ${
                    selectedItemId === item.id
                      ? "bg-primary/10 font-bold text-primary"
                      : "hover:bg-gray-1 dark:hover:bg-dark-3"
                  }`}
                >
                  <span>
                    <span className="font-mono text-[10px] text-dark-5">{item.sku}</span> · {item.name}
                  </span>
                  <span className="text-xs font-bold text-dark-5">{item.stock ?? 0} {item.unit}</span>
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-xs text-dark-5 italic">Item tidak ditemukan</p>
            )}
          </div>
          {errors.itemId && <p className="text-xs text-red-500 font-medium">{errors.itemId.message}</p>}
        </div>

        {/* Info Item Terpilih */}
        {selectedItem && (
          <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dark dark:text-white">{selectedItem.name}</p>
                <p className="text-xs text-dark-5">
                  Stok saat ini:{" "}
                  <span className={`font-black ${(selectedItem.stock ?? 0) <= (selectedItem.minimumStock ?? 0) ? "text-red-500" : "text-secondary"}`}>
                    {selectedItem.stock ?? 0} {selectedItem.unit}
                  </span>
                </p>
              </div>
              <Badge variant={selectedItem.type === "Mobil" ? "primary" : "info"} outline className="text-[10px] h-5 py-0">
                {selectedItem.type}
              </Badge>
            </div>
          </div>
        )}

        {/* Jumlah */}
        <div className="grid grid-cols-2 gap-4 items-end">
            <InputGroup
                label={`Jumlah ${isKeluar ? "Keluar" : "Masuk"}`}
                placeholder="1"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
                error={errors.quantity?.message}
                required
            />
            {selectedItem && (
                <div className="pb-3 text-sm font-bold text-dark-5 italic">
                    {selectedItem.unit}
                </div>
            )}
        </div>

        <InputGroup
          label="Catatan (Opsional)"
          placeholder={isKeluar ? "Contoh: Dipakai untuk servis B 1234 ABC" : "Contoh: Restock dari Supplier"}
          {...register("note")}
          error={errors.note?.message}
        />

        <div className="flex items-center justify-between pt-6 border-t border-stroke dark:border-dark-3 mt-4">
          <div className="flex-1">
            {selectedItem && !hasEnoughStock && (
              <p className="text-xs font-black text-red-500 bg-red/5 px-3 py-1.5 rounded border border-red/10 inline-flex items-center gap-1.5 focus:animate-shake">
                <Icons.Alert size={12} /> Stok tidak cukup
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <ActionButton variant="ghost" label="Batal" onClick={onClose} disabled={isLoading} type="button" />
            <ActionButton
              variant={isKeluar ? "danger" : "primary"}
              label={isLoading ? "Memproses..." : isKeluar ? "Kurangi Stok" : "Tambah Stok"}
              disabled={isLoading || !selectedItemId || !hasEnoughStock}
              type="submit"
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
