"use client";

import { BaseModal, ActionButton } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form handling will be implemented with react-hook-form
    onSave({} as Customer);
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
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nama Lengkap Pelanggan
          </label>
          <input
            type="text"
            defaultValue={initialData?.name}
            placeholder="Contoh: Ani Wijaya"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-bold"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nomor WhatsApp / HP
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">
              +62
            </span>
            <input
              type="tel"
              defaultValue={initialData?.phone}
              placeholder="8123456789"
              className="w-full rounded-lg border border-stroke bg-transparent pl-14 pr-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-extrabold text-lg tracking-widest"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">
            Email (Opsional)
          </label>
          <input
            type="email"
            defaultValue={initialData?.email}
            placeholder="contoh@email.com"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">
            Alamat Lengkap
          </label>
          <textarea
            defaultValue={initialData?.address}
            placeholder="Alamat penagihan atau tempat tinggal"
            rows={3}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
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
