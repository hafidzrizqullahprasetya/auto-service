"use client";

import { useState } from "react";
import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";

interface EmployeeFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

export function EmployeeFormModal({
  onClose,
  onSave,
  initialData,
  mode = "create",
  isLoading = false,
}: EmployeeFormModalProps) {
  const isEdit = mode === "edit";

  const [name, setName] = useState(initialData?.name ?? "");
  const [username, setUsername] = useState(initialData?.username ?? "");
  const [role, setRole] = useState<"admin" | "kasir">(
    (initialData?.role?.toLowerCase() === "owner"
      ? "admin"
      : initialData?.role?.toLowerCase()) ?? "kasir",
  );
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    if (!isEdit && !username.trim()) {
      return;
    }
    if (!isEdit && !password.trim()) {
      return;
    }

    const payload: any = { name, role, phone: phone.trim() || null };
    if (!isEdit) {
      payload.username = username;
      payload.password = password;
    } else if (password.trim()) {
      payload.password = password;
    }
    onSave(payload);
  };

  const inputCls =
    "w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white";

  return (
    <BaseModal
      title={isEdit ? "Edit Profil Karyawan" : "Tambah Karyawan Baru"}
      description={
        isEdit
          ? `Ubah informasi untuk staf ${initialData?.name}`
          : "Daftarkan staf atau admin baru ke sistem"
      }
      icon={<Icons.Karyawan size={20} />}
      onClose={onClose}
      maxWidth="lg"
      hideFooter
    >
      <div className="space-y-4">
        {/* Nama */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Budi Sudarsono"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Username — hanya saat create */}
        {!isEdit && (
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: budi123"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
              }
              className={inputCls}
            />
          </div>
        )}

        {/* Role */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Jabatan / Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "kasir")}
            className={inputCls}
          >
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
          </select>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Nomor WhatsApp
          </label>
          <input
            type="tel"
            placeholder="Contoh: 08123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            {isEdit
              ? "Password Baru (kosongkan jika tidak diubah)"
              : "Password"}{" "}
            {!isEdit && <span className="text-red-500">*</span>}
          </label>
          <input
            type="password"
            placeholder={
              isEdit
                ? "Biarkan kosong jika tidak ingin mengubah"
                : "Minimal 6 karakter"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3 border-t border-stroke pt-4 dark:border-dark-3">
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
                  : "Simpan Karyawan"
            }
            onClick={handleSave}
            disabled={isLoading}
          />
        </div>
      </div>
    </BaseModal>
  );
}
