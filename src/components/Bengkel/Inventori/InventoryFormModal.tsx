"use client";

import { useState } from "react";
import { BaseModal } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/mock/inventory";

interface InventoryFormModalProps {
  onClose: () => void;
  onSave: (data: Partial<Item>) => void;
  initialData?: Item | null; // jika ada = mode edit
}

export function InventoryFormModal({ onClose, onSave, initialData }: InventoryFormModalProps) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    sku: initialData?.sku ?? "",
    name: initialData?.name ?? "",
    category: initialData?.category ?? "Part",
    type: initialData?.type ?? "Mobil",
    costPrice: initialData?.costPrice ?? 0,
    price: initialData?.price ?? 0,
    stock: initialData?.stock ?? 0,
    minimumStock: initialData?.minimumStock ?? 5,
    unit: initialData?.unit ?? "pcs",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["costPrice", "price", "stock", "minimumStock"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Item Inventori" : "Tambah Item Inventori"}
      description={isEdit ? `Edit data untuk ${initialData?.name}` : "Masukkan data sparepart atau jasa baru"}
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label={isEdit ? "Simpan Perubahan" : "Simpan Item"} onClick={handleSave} />
        </div>
      }
    >
      <div className="space-y-4">
        {/* SKU */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">SKU / Kode Barang</label>
          <input
            name="sku"
            type="text"
            value={form.sku}
            onChange={handleChange}
            placeholder="Contoh: OL-SMX-1L"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-mono font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        {/* Nama */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">Nama Item / Jasa</label>
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
            <label className="text-sm font-bold text-dark dark:text-white">Kategori</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            >
              <option value="Part">Part / Sparepart</option>
              <option value="Oil">Oli</option>
              <option value="Service">Jasa Service</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Tipe Kendaraan</label>
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
            <label className="text-sm font-bold text-dark dark:text-white">Harga Modal (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">Rp</span>
              <input
                name="costPrice"
                type="number"
                value={form.costPrice}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent pl-12 pr-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Harga Jual (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">Rp</span>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent pl-12 pr-4 py-2.5 text-sm font-black text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
          </div>
        </div>

        {/* Stok & Minimum Stok */}
        {form.category !== "Service" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Stok Awal</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Min. Stok (Alert)</label>
              <input
                name="minimumStock"
                type="number"
                value={form.minimumStock}
                onChange={handleChange}
                placeholder="5"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Satuan</label>
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
        {form.price > 0 && form.costPrice > 0 && (
          <div className="rounded-lg border border-stroke bg-gray-1 px-4 py-3 dark:border-dark-3 dark:bg-dark-2">
            <p className="text-xs font-bold text-dark-5">
              Margin:{" "}
              <span className="text-secondary">
                Rp {(form.price - form.costPrice).toLocaleString("id-ID")} ({Math.round(((form.price - form.costPrice) / form.price) * 100)}%)
              </span>
            </p>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
