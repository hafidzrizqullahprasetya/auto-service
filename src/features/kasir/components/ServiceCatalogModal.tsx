"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";
import { cn } from "@/lib/utils";
import { Notify } from "@/utils/notify";
import { formatNumber, stripFormatting } from "@/utils/format-number";

const serviceSchema = z.object({
  sku: z.string().min(1, "SKU wajib diisi"),
  name: z.string().min(3, "Nama jasa minimal 3 karakter"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  standard_price: z.number().min(0, "Harga tidak boleh negatif"),
  berlaku_untuk: z.enum(["Mobil", "Motor", "Keduanya"]),
  durasi_estimasi: z.string().optional(),
  garansi: z.string().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceCatalogModalProps {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

const VEHICLE_OPTIONS = [
  { id: "Mobil", label: "Mobil", icon: Icons.KendaraanMobil },
  { id: "Motor", label: "Motor", icon: Icons.KendaraanMotor },
  { id: "Keduanya", label: "Keduanya", icon: Icons.Antrean },
];

export function ServiceCatalogModal({ onClose, onSave, initialData }: ServiceCatalogModalProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      sku: initialData?.sku || "",
      name: initialData?.namaJasa || "",
      kategori: initialData?.kategori || "Lainnya",
      standard_price: initialData?.hargaStandar || 0,
      berlaku_untuk: initialData?.berlakuUntuk || "Keduanya",
      durasi_estimasi: initialData?.durasiEstimasi || "1 Jam",
      garansi: initialData?.garansi || "-",
    },
  });

  const berlakuUntuk = watch("berlaku_untuk");
  const formValues = watch();
  const hasInitializedDraft = useRef(false);
  const draftKey = "service_catalog_draft";

  // Load Draft (Add Mode Only)
  useEffect(() => {
    if (!initialData && !hasInitializedDraft.current) {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          Object.keys(parsed).forEach((key) => {
            setValue(key as any, parsed[key]);
          });
        } catch {}
      }
      hasInitializedDraft.current = true;
    }
  }, [initialData, setValue]);

  // Save Draft (Add Mode Only)
  useEffect(() => {
    if (!initialData && hasInitializedDraft.current) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(formValues));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formValues, initialData]);

  // Auto SKU
  useEffect(() => {
    if (!initialData && !watch("sku")) {
      const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const random = Math.floor(1000 + Math.random() * 9000);
      setValue("sku", `SRV-${date}-${random}`);
    }
  }, [initialData, setValue, watch]);

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      Notify.loading("Menyimpan jasa...");
      await onSave(data);
      if (!initialData) localStorage.removeItem(draftKey);
      Notify.close();
      Notify.toast(initialData ? "Jasa berhasil diperbarui" : "Jasa baru berhasil ditambahkan", "success");
      onClose();
    } catch (error: any) {
      Notify.close();
      Notify.alert("Gagal", error.message || "Gagal menyimpan jasa", "error");
    }
  };

  return (
    <BaseModal
      title={initialData ? "Edit Jasa" : "Tambah Jasa Baru"}
      onClose={onClose}
      icon={<Icons.Plus size={20} />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="SKU / Kode Jasa"
            placeholder="SRV-XXXX"
            {...register("sku")}
            error={errors.sku?.message}
            readOnly={!!initialData}
            required
            className="font-mono uppercase"
          />
          <InputGroup
            label="Nama Jasa / Layanan"
            required
            placeholder="Contoh: Service Berkala 10.000km"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Kategori</label>
            <select
              {...register("kategori")}
              className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
            >
              <option value="Mesin">Mesin</option>
              <option value="Rem & Transmisi">Rem & Transmisi</option>
              <option value="Kelistrikan">Kelistrikan</option>
              <option value="AC & Kabin">AC & Kabin</option>
              <option value="Body & Cat">Body & Cat</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>
          <Controller
            name="standard_price"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <InputGroup
                label="Harga Standar (Rp)"
                type="text"
                required
                placeholder="0"
                value={formatNumber(value)}
                onChange={(e) => {
                  const rawValue = stripFormatting(e.target.value);
                  onChange(rawValue);
                }}
                error={errors.standard_price?.message}
                leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
                className="font-bold"
                {...field}
              />
            )}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Berlaku Untuk</label>
          <div className="flex gap-2">
            {VEHICLE_OPTIONS.map((opt) => {
              const active = berlakuUntuk === opt.id;
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setValue("berlaku_untuk", opt.id as any)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition-all",
                    active
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-stroke bg-white text-dark-5 hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark"
                  )}
                >
                  <Icon size={16} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="Estimasi Durasi"
            placeholder="Contoh: 1-2 Jam"
            {...register("durasi_estimasi")}
          />
          <InputGroup
            label="Garansi"
            placeholder="Contoh: 1 Bulan"
            {...register("garansi")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3">
           <ActionButton variant="ghost" label="Batal" onClick={onClose} type="button" />
           <ActionButton 
             variant="primary" 
             label={initialData ? "Update Jasa" : "Simpan Jasa"} 
             type="submit" 
             loading={isSubmitting} 
           />
        </div>
      </form>
    </BaseModal>
  );
}
