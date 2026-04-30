"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Icons } from "@/components/Icons";
import { BaseModal, ActionButton } from "@/features/shared";
import InputGroup from "@/components/ui/InputGroup";
import { serviceBundlesService, ApiServiceBundle } from "@/services/service-bundles.service";
import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";

const bundleSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  description: z.string().optional(),
  price: z.number().min(0, "Harga tidak boleh negatif"),
  items: z.array(z.object({
    task_name: z.string().min(1, "Nama pekerjaan tidak boleh kosong")
  })).min(1, "Minimal harus ada 1 item pekerjaan")
});

type BundleFormValues = z.infer<typeof bundleSchema>;

interface BundleModalProps {
  bundle?: ApiServiceBundle | null;
  onClose: () => void;
  onSave: () => void;
}

export function BundleModal({ bundle, onClose, onSave }: BundleModalProps) {
  const isEdit = !!bundle;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<BundleFormValues>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: bundle?.name ?? "",
      description: bundle?.description ?? "",
      price: bundle ? Number(bundle.price) : 0,
      items: bundle?.items.map(i => ({ task_name: i.task_name })) ?? [{ task_name: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const onSubmit = async (data: BundleFormValues) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        items: data.items.map(i => i.task_name)
      };

      if (isEdit && bundle) {
        await serviceBundlesService.update(bundle.id, payload);
        Notify.toast("Paket berhasil diupdate", "success");
      } else {
        await serviceBundlesService.create(payload);
        Notify.toast("Paket berhasil dibuat", "success");
      }
      onSave();
    } catch (error: any) {
      Notify.alert("Gagal Menyimpan", error.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Paket Servis" : "Buat Paket Servis Baru"}
      description="Tentukan nama paket, harga total, dan daftar item pekerjaannya."
      onClose={onClose}
      maxWidth="xl"
      hideFooter
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Nama Paket"
            placeholder="Contoh: Paket Servis Rutin A"
            {...register("name")}
            error={errors.name?.message}
            required
          />
          <InputGroup
            label="Harga Paket (Rp)"
            type="number"
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-dark-5">Deskripsi Singkat</label>
          <textarea
            {...register("description")}
            placeholder="Jelaskan keunggulan paket ini..."
            rows={2}
            className="w-full resize-none rounded-lg border-2 border-stroke bg-transparent px-4 py-2.5 text-sm font-medium outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black uppercase tracking-widest text-dark dark:text-white">
              Daftar Item Pekerjaan <span className="text-red">*</span>
            </label>
            <button
              type="button"
              onClick={() => append({ task_name: "" })}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Icons.Plus size={14} />
              Tambah Item
            </button>
          </div>

          <div className="max-h-60 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <div className="flex-1">
                  <InputGroup
                    placeholder={`Item pekerjaan #${index + 1}`}
                    {...register(`items.${index}.task_name` as const)}
                    error={errors.items?.[index]?.task_name?.message}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke text-dark-5 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:border-dark-3"
                >
                  <Icons.Delete size={16} />
                </button>
              </div>
            ))}
          </div>
          {errors.items?.message && (
            <p className="text-xs font-medium text-red-500">{errors.items.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-stroke dark:border-dark-3">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={loading}
            type="button"
          />
          <ActionButton
            variant="primary"
            label={loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Paket"}
            disabled={loading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
