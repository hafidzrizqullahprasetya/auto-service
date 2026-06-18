"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Icons } from "@/components/Icons";
import { BaseModal, ActionButton } from "@/features/shared";
import InputGroup from "@/components/ui/InputGroup";
import { purchaseOrdersService } from "@/services/purchase-orders.service";
import { useInventory } from "@/hooks/useInventory";
import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";

const poItemSchema = z.object({
  spare_part_id: z.coerce.number().min(1, "Item wajib dipilih"),
  sku: z.string().min(1, "SKU wajib diisi"),
  nama: z.string().min(1, "Nama item wajib diisi"),
  qty: z.coerce.number().min(1, "Qty minimal 1"),
  hargaSatuan: z.coerce.number().min(0, "Harga tidak boleh negatif"),
});

const poFormSchema = z.object({
  noPO: z.string().min(1, "Nomor PO wajib diisi"),
  supplier: z.string().min(1, "Supplier wajib diisi"),
  tanggal: z.string().min(1, "Tanggal PO wajib diisi"),
  estimasiTiba: z.string().optional(),
  catatan: z.string().optional(),
  items: z.array(poItemSchema).min(1, "Minimal harus ada 1 item pesanan"),
});

type POFormValues = z.infer<typeof poFormSchema>;

interface PurchaseOrderFormModalProps {
  onClose: () => void;
  onSave: () => void;
}

export function PurchaseOrderFormModal({ onClose, onSave }: PurchaseOrderFormModalProps) {
  const [loading, setLoading] = useState(false);
  const { data: inventoryItems, loading: inventoryLoading } = useInventory();

  // Filter out service items
  const sparePartsList = useMemo(() => {
    return inventoryItems.filter(item => item.unit !== "jasa" && item.category !== "Service");
  }, [inventoryItems]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm<POFormValues>({
    resolver: zodResolver(poFormSchema) as any,
    defaultValues: {
      noPO: "",
      supplier: "",
      tanggal: new Date().toISOString().split("T")[0],
      estimasiTiba: "",
      catatan: "",
      items: [{ spare_part_id: 0, sku: "", nama: "", qty: 1, hargaSatuan: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchItems = watch("items");

  const onSubmit = async (data: POFormValues) => {
    try {
      setLoading(true);
      Notify.loading("Menyimpan Purchase Order...");

      const payload = {
        noPO: data.noPO,
        tanggal: data.tanggal,
        supplier: data.supplier,
        catatan: data.catatan || "",
        estimasiTiba: data.estimasiTiba || null,
        items: data.items.map(item => ({
          spare_part_id: Number(item.spare_part_id),
          sku: item.sku,
          nama: item.nama,
          qty: Number(item.qty),
          hargaSatuan: Number(item.hargaSatuan)
        }))
      };

      await purchaseOrdersService.create(payload);
      Notify.toast("Purchase Order berhasil dibuat", "success", "top");
      onSave();
    } catch (error: any) {
      console.error(error);
      const isConflict = error.status === 409 || 
        (error.message && (error.message.includes("sudah ada") || error.message.includes("sudah digunakan") || error.message.includes("Conflict")));
      
      if (isConflict) {
        Notify.alert("Gagal Menyimpan", "Nomor PO sudah digunakan", "error");
      } else {
        Notify.alert("Gagal Menyimpan", error.message || "Terjadi kesalahan pada server", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title="Buat Purchase Order Baru"
      description="Masukkan rincian PO dan daftar item yang dipesan ke supplier."
      onClose={onClose}
      maxWidth="3xl"
      hideFooter
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* PO Details Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Nomor PO"
            placeholder="Contoh: PO/2026/06/001"
            {...register("noPO")}
            error={errors.noPO?.message}
            required
          />
          <InputGroup
            label="Supplier"
            placeholder="Nama Supplier"
            {...register("supplier")}
            error={errors.supplier?.message}
            required
          />
          <InputGroup
            label="Tanggal PO"
            type="date"
            {...register("tanggal")}
            error={errors.tanggal?.message}
            required
          />
          <InputGroup
            label="Estimasi Tanggal Tiba"
            type="date"
            {...register("estimasiTiba")}
            error={errors.estimasiTiba?.message}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-dark-5">Catatan</label>
          <textarea
            {...register("catatan")}
            placeholder="Catatan tambahan..."
            rows={2}
            className="w-full resize-none rounded-lg border-2 border-stroke bg-transparent px-4 py-2.5 text-sm font-medium outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        {/* PO Items List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black uppercase tracking-widest text-dark dark:text-white">
              Daftar Item Pesanan <span className="text-red">*</span>
            </label>
            <button
              type="button"
              onClick={() => append({ spare_part_id: 0, sku: "", nama: "", qty: 1, hargaSatuan: 0 })}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <Icons.Plus size={14} />
              Tambah Item
            </button>
          </div>

          <div className="max-h-80 space-y-4 overflow-y-auto pr-2 custom-scrollbar border border-stroke dark:border-dark-3 rounded-xl p-3 bg-gray-2/20">
            {fields.map((field, index) => {
              const selectedId = watchItems[index]?.spare_part_id;

              return (
                <div key={field.id} className="relative flex flex-col gap-4 rounded-xl border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 p-4 pt-8 sm:pt-4 sm:flex-row sm:items-start">
                  {/* Delete Button (absolute on mobile, normal on desktop) */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-stroke text-dark-5 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:border-dark-3 sm:static sm:mt-8 sm:h-10 sm:w-10 sm:shrink-0"
                  >
                    <Icons.Delete size={16} />
                  </button>

                  {/* Fields Container */}
                  <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-4">
                    {/* Select Item */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-dark-5">Pilih Sparepart</label>
                      <select
                        value={selectedId || 0}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const matched = sparePartsList.find(item => Number(item.id) === val);
                          if (matched) {
                            setValue(`items.${index}.spare_part_id`, val);
                            setValue(`items.${index}.sku`, matched.sku || "");
                            setValue(`items.${index}.nama`, matched.name || "");
                            setValue(`items.${index}.hargaSatuan`, matched.costPrice || 0);
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border-2 border-stroke bg-white px-3 py-2 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white",
                          errors.items?.[index]?.spare_part_id && "border-red-500"
                        )}
                      >
                        <option value={0} disabled>
                          -- Pilih Sparepart --
                        </option>
                        {sparePartsList.map((sp) => (
                          <option key={sp.id} value={sp.id}>
                            {sp.sku ? `[${sp.sku}] ` : ""}{sp.name}
                          </option>
                        ))}
                      </select>
                      {errors.items?.[index]?.spare_part_id?.message && (
                        <p className="text-[10px] text-red-500">{errors.items[index].spare_part_id.message}</p>
                      )}
                    </div>

                    {/* Qty */}
                    <div className="space-y-1">
                      <InputGroup
                        label="Qty"
                        type="number"
                        placeholder="1"
                        {...register(`items.${index}.qty` as const)}
                        error={errors.items?.[index]?.qty?.message}
                      />
                    </div>

                    {/* Harga Satuan */}
                    <div className="space-y-1">
                      <InputGroup
                        label="Harga Beli (Rp)"
                        type="number"
                        placeholder="0"
                        {...register(`items.${index}.hargaSatuan` as const)}
                        error={errors.items?.[index]?.hargaSatuan?.message}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.items?.message && (
            <p className="text-xs font-medium text-red-500">{errors.items.message}</p>
          )}
        </div>

        {/* Footer Actions */}
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
            label={loading ? "Menyimpan..." : "Buat PO"}
            disabled={loading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
