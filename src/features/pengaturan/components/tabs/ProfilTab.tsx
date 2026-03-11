"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";
import { SectionCard } from "./SectionCard";
import { ProfilTabSkeleton } from "./ProfilTabSkeleton";
import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";
import { formatWhatsApp } from "@/utils/format-phone";

const profileSchema = z.object({
  name: z.string().min(3, "Nama bengkel minimal 3 karakter"),
  phone: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfilTabProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export function ProfilTab({ settings, onSave, loading, saving }: ProfilTabProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: settings?.name ?? "",
      phone: settings?.phone ?? "",
      address: settings?.address ?? "",
    },
  });

  // Sync form with settings when they load
  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name || "",
        phone: settings.phone || "",
        address: settings.address || "",
      });
    }
  }, [settings, reset]);

  if (loading) return <ProfilTabSkeleton />;

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    await onSave(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-6">
        <SectionCard title="Identitas Bengkel">
          <div className="mb-6 flex flex-col items-center gap-5 md:flex-row md:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-stroke bg-gray-2 dark:border-dark-4 dark:bg-dark-3">
              <Icons.Dashboard size={30} className="text-dark-5" />
            </div>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <p className="text-sm font-bold text-dark dark:text-white">
                Logo Bengkel
              </p>
              <p className="mt-1 text-xs font-medium text-dark-5">
                PNG, JPG MAKS 2MB · 500×500PX
              </p>
              <button
                type="button"
                className="mt-3 w-full rounded-lg border-2 border-dark bg-dark px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-white hover:text-dark dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white md:w-auto"
              >
                GANTI LOGO
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputGroup
              label="Nama Bengkel"
              placeholder="Masukkan nama bengkel"
              {...register("name")}
              error={errors.name?.message}
              disabled={saving}
              required
            />
            <InputGroup
              label="Nomor WhatsApp"
              placeholder="Contoh: 08123456789"
              {...register("phone")}
              onChange={(e) => {
                const val = formatWhatsApp(e.target.value);
                setValue("phone", val, { shouldValidate: true });
              }}
              error={errors.phone?.message}
              disabled={saving}
              required
              leftIcon={<Icons.Whatsapp className="text-secondary" size={18} />}
            />
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-dark-5 dark:text-dark-6">
              Alamat Operasional
            </label>
            <textarea
              rows={3}
              {...register("address")}
              placeholder="Alamat lengkap bengkel"
              className={cn(
                "w-full resize-none rounded-lg border-2 border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white",
                errors.address && "!border-red-500 focus:!border-red-500"
              )}
              disabled={saving}
            />
            {errors.address && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg border-2 border-dark bg-dark px-10 py-3 text-sm font-bold text-white shadow-none transition-all hover:bg-white hover:text-dark active:scale-100 disabled:opacity-50 dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white sm:w-auto"
          >
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
