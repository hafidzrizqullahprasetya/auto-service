"use client";

import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { ActionButton } from "@/components/Bengkel/shared";
import { Customer } from "@/mock/customers";

interface DeleteConfirmModalProps {
  customer: Customer;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  customer,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <BaseModal
      title="Hapus Pelanggan?"
      description={`Apakah Anda yakin ingin menghapus ${customer.name}?`}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <Icons.Alert size={24} className="text-red-600" />
        </div>
      }
      onClose={onClose}
      maxWidth="md"
      hideFooter
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            ⚠️ Data yang dihapus tidak dapat dikembalikan. Riwayat transaksi
            akan tetap tersimpan.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
          />
          <ActionButton
            variant="destructive"
            label={isLoading ? "Menghapus..." : "Ya, Hapus"}
            onClick={onConfirm}
            disabled={isLoading}
          />
        </div>
      </div>
    </BaseModal>
  );
}
