"use client";

import { BaseModal } from "./BaseModal";
import { ActionButton } from "./ActionButton";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface ConfirmDeleteModalProps {
  title?: string;
  description?: string;
  itemDisplay?: string; // Text to highlight what is being deleted
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  title = "Hapus Data",
  description = "Apakah Anda yakin ingin menghapus data ini?",
  itemDisplay,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <BaseModal
      title={title}
      onClose={onClose}
      maxWidth="sm"
      hideFooter
    >
      <div className="flex flex-col items-center py-4 text-center">
        {/* Warning Icon Container */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red/10 text-red">
          <Icons.Delete size={40} />
        </div>

        <h3 className="mb-2 text-xl font-bold text-dark dark:text-white">
          {title}
        </h3>
        
        <p className="px-4 text-sm font-medium text-dark-5 dark:text-dark-6 leading-relaxed">
          {description}
          {itemDisplay && (
            <span className="mt-2 block font-black text-dark dark:text-white underline decoration-red/30 decoration-2 underline-offset-4">
              "{itemDisplay}"
            </span>
          )}
        </p>

        <p className="mt-4 px-8 text-[11px] font-bold uppercase tracking-wider text-red/60">
          Tindakan ini tidak dapat dibatalkan
        </p>

        {/* Action Buttons */}
        <div className="mt-10 grid w-full grid-cols-2 gap-3">
          <ActionButton
            variant="secondary"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 rounded-xl"
          />
          <ActionButton
            variant="danger"
            label={isLoading ? "Menghapus..." : "Ya, Hapus"}
            onClick={onConfirm}
            disabled={isLoading}
            className="h-12 rounded-xl bg-red text-white hover:bg-red/90"
          />
        </div>
      </div>
    </BaseModal>
  );
}
