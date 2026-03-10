"use client";

import { useState } from "react";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/mock/inventory";
import { ApiCategory } from "@/types/api";
import { formatNumber, stripFormatting } from "@/lib/format-number";
import { Notify } from "@/utils/notify";

interface InventoryFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Item | null;
  categories?: ApiCategory[];
  isLoading?: boolean;
}

export function InventoryFormModal({
  onClose,
  onSave,
  initialData,
  categories = [],
  isLoading = false,
}: InventoryFormModalProps) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    sku: initialData?.sku ?? "",
    name: initialData?.name ?? "",
    category_id:
      initialData?.categoryId ??
      (categories.length > 0 ? categories[0].id : ""),
    type: initialData?.type ?? "Mobil",
    cost_price: initialData?.costPrice ? String(initialData.costPrice) : "",
    sell_price: initialData?.price ? String(initialData.price) : "",
    current_stock: initialData?.stock ? String(initialData.stock) : "",
    minimum_stock: initialData?.minimumStock
      ? String(initialData.minimumStock)
      : "5",
    unit: initialData?.unit ?? "pcs",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Handle number formatting for price and stock fields
    if (
      ["cost_price", "sell_price", "current_stock", "minimum_stock"].includes(
        name,
      )
    ) {
      // Remove non-digit characters
      const numericValue = value.replace(/\D/g, "");
      // Format with comma separator
      const formatted = numericValue ? formatNumber(Number(numericValue)) : "";
      setForm((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    // Validasi sederhana
    if (!form.name || !form.category_id) {
      Notify.alert("Gagal!", "Nama dan Kategori wajib diisi");
      return;
    }

    onSave({
      category_id: Number(form.category_id),
      name: form.name,
      sku: form.sku, // BE might generate but we can pass it
      cost_price: stripFormatting(form.cost_price),
      sell_price: stripFormatting(form.sell_price),
      current_stock: stripFormatting(form.current_stock),
      minimum_stock: stripFormatting(form.minimum_stock),
      unit: form.unit,
    });
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Item Inventori" : "Tambah Item Inventori"}
      description={
        isEdit
          ? `Edit data untuk ${initialData?.name}`
          : "Masukkan data sparepart atau jasa baru"
      }
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
          />
          <ActionButton
            variant="primary"
            label={
              isLoading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Simpan Item"
            }
            onClick={handleSave}
            disabled={isLoading}
          />
        </div>
      }
    >
      <div className="space-y-4">
        {/* SKU */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            SKU / Kode Barang
          </label>
          <input
            name="sku"
            type="text"
            value={form.sku}
            onChange={handleChange}
            placeholder="Contoh: OL-SMX-1L"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 font-mono text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        {/* Nama */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nama Item / Jasa
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Oli Yamalube Sport 1L"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        {/* Kategori & Tipe */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Kategori
            </label>
            <select
              name="category_id"
              value={(form as any).category_id ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              required
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Tipe Kendaraan
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            >
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
              <option value="Umum">Umum (Keduanya)</option>
            </select>
          </div>
        </div>

        {/* Harga Modal & Harga Jual */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Harga Modal (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">
                Rp
              </span>
              <input
                name="cost_price"
                type="text"
                inputMode="numeric"
                value={form.cost_price}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Harga Jual (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">
                Rp
              </span>
              <input
                name="sell_price"
                type="text"
                inputMode="numeric"
                value={form.sell_price}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-12 pr-4 text-sm font-bold text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
          </div>
        </div>

        {/* Stok & Minimum Stok */}
        {form.unit !== "jasa" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">
                Stok Awal
              </label>
              <input
                name="current_stock"
                type="text"
                inputMode="numeric"
                value={form.current_stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">
                Min. Stok (Alert)
              </label>
              <input
                name="minimum_stock"
                type="text"
                inputMode="numeric"
                value={form.minimum_stock}
                onChange={handleChange}
                placeholder="5"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">
                Satuan
              </label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              >
                <option value="pcs">pcs</option>
                <option value="liter">liter</option>
                <option value="set">set</option>
                <option value="unit">unit</option>
                <option value="jasa">jasa</option>
              </select>
            </div>
          </div>
        )}

        {/* Info margin */}
        {stripFormatting(form.sell_price) > 0 &&
          stripFormatting(form.cost_price) > 0 && (
            <div className="rounded-lg border border-stroke bg-gray-1 px-4 py-3 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-bold text-dark-5">
                Margin:{" "}
                <span className="text-secondary">
                  Rp{" "}
                  {formatNumber(
                    stripFormatting(form.sell_price) -
                      stripFormatting(form.cost_price),
                  )}{" "}
                  (
                  {Math.round(
                    ((stripFormatting(form.sell_price) -
                      stripFormatting(form.cost_price)) /
                      stripFormatting(form.sell_price)) *
                      100,
                  )}
                  %)
                </span>
              </p>
            </div>
          )}
      </div>
    </BaseModal>
  );
}
