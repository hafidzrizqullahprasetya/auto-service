"use client";

import { useState } from "react";
import { BaseModal } from "@/features/shared";
import { ActionButton } from "@/features/shared";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useInventory } from "@/hooks/useInventory";
import { Item } from "@/mock/inventory";
import { formatNumber } from "@/lib/format-number";

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
  const { data: inventoryItems, loading } = useInventory();
  const [selectedItemId, setSelectedItemId] = useState(
    preselectedItem?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const physicalItems = inventoryItems.filter((i) => i.category !== "Service");
  const filtered = physicalItems.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedItem = inventoryItems.find((i) => i.id === selectedItemId);

  const handleSave = () => {
    if (!selectedItemId || quantity <= 0) return;
    onSave({ itemId: selectedItemId, quantity, note });
    // onClose is called by parent after API succeeds
  };

  const isKeluar = type === "keluar";
  const hasEnoughStock =
    !isKeluar || !selectedItem?.stock || selectedItem.stock >= quantity;

  return (
    <BaseModal
      title={isKeluar ? "Catat Stok Keluar" : "Catat Stok Masuk"}
      description={
        isKeluar
          ? "Kurangi stok karena pemakaian atau pengeluaran manual"
          : "Tambah stok karena restock dari supplier"
      }
      icon={
        isKeluar ? <Icons.Logout size={20} /> : <Icons.Inventory size={20} />
      }
      onClose={onClose}
      maxWidth="md"
      footer={
        <div className="flex items-center justify-between">
          {!hasEnoughStock && (
            <p className="text-xs font-bold text-red-500">
              ⚠ Stok tidak cukup (tersedia: {selectedItem?.stock}{" "}
              {selectedItem?.unit})
            </p>
          )}
          <div className="ml-auto flex gap-3">
            <ActionButton
              variant="ghost"
              label="Batal"
              onClick={onClose}
              disabled={isLoading}
            />
            <ActionButton
              variant={isKeluar ? "danger" : "primary"}
              label={
                isLoading
                  ? isKeluar
                    ? "Mengurangi Stok..."
                    : "Menambah Stok..."
                  : isKeluar
                    ? "Kurangi Stok"
                    : "Tambah Stok"
              }
              onClick={handleSave}
              disabled={
                !selectedItemId || quantity <= 0 || !hasEnoughStock || isLoading
              }
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Pilih Item */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Pilih Item
          </label>
          <div className="relative">
            <Icons.Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5"
            />
            <input
              type="text"
              placeholder="Cari SKU atau nama..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-stroke dark:border-dark-3">
            {loading ? (
              <div className="space-y-2 p-2">
                {[...Array(5)].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-32" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:border-dark dark:hover:bg-dark-3 ${
                    selectedItemId === item.id
                      ? "bg-primary/10 font-bold text-primary"
                      : "hover:bg-gray-2"
                  }`}
                >
                  <span>
                    <span className="font-mono text-xs text-dark-5">
                      {item.sku}
                    </span>
                    {" · "}
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-dark-5">
                    {item.stock ?? 0} {item.unit}
                  </span>
                </button>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-dark-5">
                Item tidak ditemukan
              </p>
            )}
          </div>
        </div>

        {/* Info Item Terpilih */}
        {selectedItem && (
          <div className="rounded-lg border border-stroke bg-gray-1 p-3 dark:border-dark-3 dark:bg-dark-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-dark dark:text-white">
                  {selectedItem.name}
                </p>
                <p className="text-xs text-dark-5">
                  Stok saat ini:{" "}
                  <span
                    className={`font-bold ${
                      (selectedItem.stock ?? 0) <=
                      (selectedItem.minimumStock ?? 0)
                        ? "text-red-500"
                        : "text-secondary"
                    }`}
                  >
                    {selectedItem.stock ?? 0} {selectedItem.unit}
                  </span>
                  {selectedItem.minimumStock && (
                    <>
                      {" "}
                      · Min: {selectedItem.minimumStock} {selectedItem.unit}
                    </>
                  )}
                </p>
              </div>
              <Badge
                variant={selectedItem.type === "Mobil" ? "primary" : "info"}
                className="text-[10px]"
              >
                {selectedItem.type}
              </Badge>
            </div>
            <p className="mt-1 text-xs font-bold text-dark-5">
              Harga Jual: Rp {formatNumber(selectedItem.price)} /{" "}
              {selectedItem.unit}
            </p>
          </div>
        )}

        {/* Jumlah */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Jumlah {isKeluar ? "Keluar" : "Masuk"}
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke font-bold hover:bg-gray-2 dark:border-dark-3"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="h-10 w-20 rounded-lg border border-stroke bg-transparent text-center text-sm font-bold text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke font-bold hover:bg-gray-2 dark:border-dark-3"
            >
              +
            </button>
            {selectedItem && (
              <span className="text-sm font-medium text-dark-5">
                {selectedItem.unit}
              </span>
            )}
          </div>
        </div>

        {/* Catatan */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Catatan <span className="font-normal text-dark-5">(opsional)</span>
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={
              isKeluar
                ? "Contoh: Dipakai untuk servis B 1234 ABC"
                : "Contoh: Restock dari Supplier Mega Motor"
            }
            className="w-full resize-none rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
