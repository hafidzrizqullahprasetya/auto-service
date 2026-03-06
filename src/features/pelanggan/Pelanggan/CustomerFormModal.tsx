"use client";

import { useState } from "react";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Customer } from "@/mock/customers";

interface CustomerFormModalProps {
  mode?: "create" | "edit";
  initialData?: Customer;
  onClose: () => void;
  onSave: (data: Customer) => void;
  isLoading?: boolean;
}

export function CustomerFormModal({
  mode = "create",
  initialData,
  onClose,
  onSave,
  isLoading = false,
}: CustomerFormModalProps) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    address: initialData?.address ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as any);
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
      description={
        isEdit
          ? "Ubah data profil pelanggan"
          : "Simpan data profil pelanggan untuk program loyalitas"
      }
      icon={<Icons.Pelanggan size={20} />}
      onClose={onClose}
      maxWidth="lg"
      hideFooter
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nama Lengkap Pelanggan
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Ani Wijaya"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nomor WhatsApp / HP
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">
              +62
            </span>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="8123456789"
              className="w-full rounded-lg border border-stroke bg-transparent pl-14 pr-4 py-2.5 text-sm font-bold text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Email (Opsional)
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="contoh@email.com"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Alamat Lengkap
          </label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Alamat penagihan atau tempat tinggal"
            rows={3}
            className="w-full resize-none rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-stroke dark:border-dark-3 mt-6">
          <ActionButton
            variant="ghost"
            label={isLoading ? "Menyimpan..." : "Batal"}
            onClick={onClose}
            disabled={isLoading}
            type="button"
          />
          <ActionButton
            variant="primary"
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Pelanggan"}
            onClick={() => {}}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
