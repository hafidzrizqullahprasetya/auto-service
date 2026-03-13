"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import TimePicker from "@/components/ui/TimePicker";
import { SectionCard } from "./SectionCard";
import { OperasionalTabSkeleton } from "./OperasionalTabSkeleton";
import { Notify } from "@/utils/notify";
import { TabSaveButton } from "../shared/TabSaveButton";

const operationalSchema = z.object({
  open_time: z.string().min(4, "Jam buka harus diisi"),
  close_time: z.string().min(4, "Jam tutup harus diisi"),
  operational_days: z.string().min(1, "Minimal satu hari operasional dipilih"),
  tax_percentage: z.coerce.number().min(0, "Pajak tidak boleh negatif").max(100, "Pajak maksimal 100%"),
});

type OperationalFormValues = z.infer<typeof operationalSchema>;

interface OperasionalTabProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

const DAYS = [
  { id: "1", label: "Sen" },
  { id: "2", label: "Sel" },
  { id: "3", label: "Rab" },
  { id: "4", label: "Kam" },
  { id: "5", label: "Jum" },
  { id: "6", label: "Sab" },
  { id: "0", label: "Min" },
];

export function OperasionalTab({ settings, onSave, loading, saving }: OperasionalTabProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<OperationalFormValues>({
    resolver: zodResolver(operationalSchema),
    defaultValues: {
      open_time: settings?.open_time ?? "08:00",
      close_time: settings?.close_time ?? "17:00",
      operational_days: settings?.operational_days ?? "1,2,3,4,5,6",
      tax_percentage: Number(settings?.tax_percentage ?? 0),
    },
  });

  useEffect(() => {
    if (settings) {
      const daysStr = settings.operational_days || "1,2,3,4,5,6";
      reset({
        open_time: settings.open_time || "08:00",
        close_time: settings.close_time || "17:00",
        operational_days: daysStr,
        tax_percentage: Number(settings.tax_percentage ?? 0),
      });
      setSelectedDays(daysStr.split(","));
    }
  }, [settings, reset]);

  const toggleDay = (dayId: string) => {
    const next = selectedDays.includes(dayId)
      ? selectedDays.filter((d) => d !== dayId)
      : [...selectedDays, dayId];
    
    // Sort slightly to keep string consistent e.g. "1,2,3"
    const sorted = [...next].sort((a, b) => Number(a) - Number(b));
    setSelectedDays(sorted);
    setValue("operational_days", sorted.join(","), { shouldValidate: true });
  };

  if (loading) return <OperasionalTabSkeleton />;

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Cek Kembali", firstError.message, "error");
    }
  };

  const onSubmit = async (data: OperationalFormValues) => {
    await onSave(data);
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="flex flex-col gap-6">
        <SectionCard title="Jam Operasional Bengkel">
          <div className="mb-4 rounded-lg border border-stroke bg-gray-1 p-3 text-xs text-dark-5 dark:border-dark-3 dark:bg-dark-2">
            <p>
              Jam operasional menentukan kapan bengkel menerima pendaftaran servis (Antrean) di sistem.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="open_time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Jam Buka"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.open_time?.message}
                  disabled={saving}
                  required
                />
              )}
            />
            <Controller
              name="close_time"
              control={control}
              render={({ field }) => (
                <TimePicker
                  label="Jam Tutup"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.close_time?.message}
                  disabled={saving}
                  required
                />
              )}
            />
          </div>
          
          <div className="mt-6">
            <label className="mb-3 block text-sm font-semibold text-dark-5 dark:text-dark-6">
              Hari Operasional
            </label>
            <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-3">
              {DAYS.map((d) => {
                const active = selectedDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    disabled={saving}
                    className={cn(
                      "rounded-lg border-2 py-2.5 text-xs font-bold transition-all md:px-6",
                      active
                        ? "border-dark bg-dark text-white shadow-none dark:border-white dark:bg-white dark:text-dark"
                        : "border-stroke bg-white text-dark-5 hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark",
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
            {errors.operational_days && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errors.operational_days.message}
              </p>
            )}
          </div>
          <div className="mt-8 border-t border-stroke pt-6 dark:border-dark-3">
             <label className="mb-3 block text-sm font-semibold text-dark dark:text-white">
                Pajak & Biaya
             </label>
             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <label className="mb-2 block text-xs font-bold uppercase text-dark-5">
                    Persentase PPN (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      {...register("tax_percentage")}
                      placeholder="Contoh: 11"
                      className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-2.5 pr-10 text-sm font-black text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                    />
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">
                      %
                    </div>
                  </div>
                  {errors.tax_percentage && (
                    <p className="mt-1 text-xs font-medium text-red-500">{errors.tax_percentage.message}</p>
                  )}
                  <p className="mt-2 text-[10px] font-medium text-dark-5">
                    Set ke 0 jika tidak ada pajak yang dikenakan pada transaksi.
                  </p>
                </div>
             </div>
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <TabSaveButton 
            loading={saving} 
            label="Simpan Operasional" 
          />
        </div>
      </form>
    </div>
  );
}
