"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Customer } from "@/types/customer";
import InputGroup from "@/components/ui/InputGroup";
import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";
import { formatWhatsApp } from "@/utils/format-phone";

const customerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(8, "Nomor HP minimal 8 digit"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
      address: initialData?.address ?? "",
    },
  });

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<CustomerFormValues> = (data) => {
    onSave(data as any);
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
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid) as any} 
        className="space-y-4"
        noValidate
      >
        <InputGroup
          label="Nama Lengkap Pelanggan"
          placeholder="Contoh: Ani Wijaya"
          {...register("name")}
          error={errors.name?.message}
          required
        />

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
          required
        />

        <InputGroup
          label="Email (Opsional)"
          placeholder="contoh@email.com"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
            Alamat Lengkap
          </label>
          <textarea
            {...register("address")}
            placeholder="Alamat penagihan atau tempat tinggal"
            rows={3}
            className={cn(
              "w-full resize-none rounded-lg border-2 border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2",
              errors.address && "!border-red-500 focus:!border-red-500"
            )}
          />
          {errors.address && (
            <p className="mt-1 text-xs font-medium text-red-500">{errors.address.message}</p>
          )}
        </div>

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
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Pelanggan"}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
