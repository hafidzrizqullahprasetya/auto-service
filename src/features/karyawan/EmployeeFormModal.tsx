"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";

const employeeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore"),
  role: z.enum(["admin", "kasir"]),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().optional(),
}).refine(data => {
    return true;
}, { message: "Password wajib diisi" });

type EmployeeFormValues = z.infer<typeof employeeSchema>;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      username: initialData?.username ?? "",
      role: (initialData?.role?.toLowerCase() === "owner" ? "admin" : initialData?.role?.toLowerCase()) ?? "kasir",
      phone: initialData?.phone ?? "",
      password: "",
    },
  });

  const onFormSubmit: SubmitHandler<EmployeeFormValues> = (data) => {
    if (!isEdit && !data.password) {
        // Manually check password if zod didn't catch it and it's create mode
        // Though we can add it to zod
        alert("Password wajib diisi untuk karyawan baru");
        return;
    }

    const payload: any = { 
        name: data.name, 
        role: data.role, 
        phone: data.phone?.trim() || null 
    };
    
    if (!isEdit) {
      payload.username = data.username;
      payload.password = data.password;
    } else if (data.password?.trim()) {
      payload.password = data.password;
    }
    
    onSave(payload);
  };

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
      <form onSubmit={handleSubmit(onFormSubmit) as any} className="space-y-4">
        <InputGroup
          label="Nama Lengkap"
          placeholder="Contoh: Budi Sudarsono"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        {!isEdit && (
          <InputGroup
            label="Username"
            placeholder="Contoh: budi123"
            {...register("username")}
            error={errors.username?.message}
            required
            onChange={(e) => {
              e.target.value = e.target.value.toLowerCase().replace(/\s/g, "");
            }}
          />
        )}

        <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Jabatan / Role
            </label>
            <select
                {...register("role")}
                className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
            >
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
            </select>
        </div>

        <InputGroup
          label="Nomor WhatsApp"
          placeholder="Contoh: 08123456789"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <InputGroup
          label={isEdit ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}
          placeholder={isEdit ? "Biarkan kosong jika tidak ingin mengubah" : "Minimal 6 karakter"}
          type="password"
          {...register("password")}
          error={errors.password?.message}
          required={!isEdit}
        />

        <div className="flex justify-end gap-3 pt-6 border-t border-stroke dark:border-dark-3 mt-6">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          />
          <ActionButton
            variant="primary"
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Karyawan"}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
