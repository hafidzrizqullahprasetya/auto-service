"use client";

import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
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
        <div className="rounded-lg border border-stroke bg-gray-2/50 dark:border-dark-3 dark:bg-dark-2 p-4">
          <div className="flex gap-3">
            <Icons.Alert size={18} className="text-red-600 shrink-0" />
            <p className="text-xs font-bold text-dark-5 leading-relaxed">
              Tindakan ini permanen. Profil <span className="text-dark dark:text-white font-black">{customer.name}</span> akan dihapus dari database pelanggan, namun riwayat transaksi servis sebelumnya akan tetap diarsipkan untuk laporan keuangan.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
          />
          <ActionButton
            variant="danger"
            label={isLoading ? "Menghapus..." : "Ya, Hapus"}
            onClick={onConfirm}
            disabled={isLoading}
          />
        </div>
      </div>
    </BaseModal>
  );
}
