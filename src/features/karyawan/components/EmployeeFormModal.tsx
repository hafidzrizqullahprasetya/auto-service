"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";
import { Notify } from "@/utils/notify";
import { formatWhatsApp } from "@/utils/format-phone";
import { cn } from "@/lib/utils";

const employeeSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore"),
  role: z.enum(["admin", "kasir"]),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().optional(),
});

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
    setValue,
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

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<EmployeeFormValues> = (data) => {
    if (!isEdit && !data.password) {
        Notify.alert("Form Belum Lengkap", "Password wajib diisi untuk karyawan baru", "error");
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
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid) as any} 
        className="space-y-4"
        noValidate
      >
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
              setValue("username", e.target.value.toLowerCase().replace(/\s/g, ""));
            }}
          />
        )}

        <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Jabatan / Role <span className="text-red">*</span>
            </label>
            <select
                {...register("role")}
                className={cn(
                    "w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
                    errors.role && "!border-red-500 focus:!border-red-500"
                )}
            >
                <option value="admin">Admin</option>
                <option value="kasir">Kasir</option>
            </select>
            {errors.role && (
                <p className="mt-1 text-xs font-medium text-red-500">{errors.role.message}</p>
            )}
        </div>

        <InputGroup
          label="Nomor WhatsApp"
          placeholder="Contoh: 08123456789"
          type="tel"
          leftIcon={<Icons.Whatsapp size={18} className="text-secondary" />}
          {...register("phone")}
          onChange={(e) => {
            const formatted = formatWhatsApp(e.target.value);
            setValue("phone", formatted);
          }}
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
