"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/types/inventory";
import { ApiCategory } from "@/types/api";
import { formatNumber, stripFormatting, formatCurrency } from "@/utils/format-number";
import InputGroup from "@/components/ui/InputGroup";
import { cn } from "@/lib/utils";
import { Notify } from "@/utils/notify";
import { CategoryFormModal } from "./CategoryFormModal";
import { useState, useMemo, useEffect, useRef } from "react";
import { Controller } from "react-hook-form";

const inventorySchema = z.object({
  sku: z.string().min(1, "SKU wajib diisi"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  category_id: z.coerce.number().min(1, "Kategori wajib dipilih"),
  type: z.string(),
  cost_price: z.number().min(0, "Harga modal wajib diisi"),
  sell_price: z.number().min(0, "Harga jual wajib diisi"),
  current_stock: z.number().optional(),
  minimum_stock: z.number().optional(),
  unit: z.string().min(1, "Satuan wajib diisi"),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Item | null;
  categories?: ApiCategory[];
  isLoading?: boolean;
  onAddCategory?: (name: string) => Promise<ApiCategory>;
}

export function InventoryFormModal({
  onClose,
  onSave,
  initialData,
  categories = [],
  isLoading = false,
  onAddCategory,
}: InventoryFormModalProps) {
  const isEdit = !!initialData;
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      sku: initialData?.sku ?? "",
      name: initialData?.name ?? "",
      category_id: initialData?.categoryId ?? (categories.length > 0 ? categories[0].id : 0),
      type: initialData?.type ?? "Mobil",
      cost_price: initialData?.costPrice || 0,
      sell_price: initialData?.price || 0,
      current_stock: initialData?.stock || 0,
      minimum_stock: initialData?.minimumStock || 5,
      unit: initialData?.unit ?? "pcs",
    },
  });

  const formValues = watch();

  const hasInitializedDraft = useRef(false);

  // Load and save Draft
  useEffect(() => {
    if (!isEdit && !hasInitializedDraft.current) {
      const draft = localStorage.getItem("inventory_form_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          Object.keys(parsed).forEach(key => {
            setValue(key as any, parsed[key]);
          });
        } catch {}
      }
      hasInitializedDraft.current = true;
    }
  }, [isEdit, setValue]);

  useEffect(() => {
    if (!isEdit && hasInitializedDraft.current) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem("inventory_form_draft", JSON.stringify(formValues));
      }, 500); // Debounce save
      return () => clearTimeout(timeoutId);
    }
  }, [formValues, isEdit]);

  // Handle Automatic SKU
  const generateSKU = () => {
    const prefix = "ASP"; 
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${date}-${random}`;
  };

  useEffect(() => {
    if (!isEdit && !watch("sku")) {
      setValue("sku", generateSKU());
    }
  }, [isEdit, setValue, watch]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    const formatted = numericValue ? formatNumber(Number(numericValue)) : "";
    setValue(name as any, formatted);
  };

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error", "320px");
    }
  };

  const onFormSubmit: SubmitHandler<InventoryFormValues> = async (data) => {
    try {
      await onSave({
        ...data,
        category_id: Number(data.category_id),
        cost_price: data.cost_price,
        sell_price: data.sell_price,
        current_stock: data.current_stock,
        minimum_stock: data.minimum_stock,
      });
      
      if (!isEdit) {
        localStorage.removeItem("inventory_form_draft");
      }
    } catch (error) {
    }
  };

  const sellPriceNum = formValues.sell_price;
  const costPriceNum = formValues.cost_price;

  return (
    <BaseModal
      title={isEdit ? "Edit Item Inventori" : "Tambah Item Inventori"}
      description={
        isEdit
          ? `Edit data dan stok untuk ${initialData?.name}`
          : "Masukkan data sparepart baru ke sistem"
      }
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="lg"
      hideFooter
    >
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid)} 
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup
            label="SKU / Kode Barang"
            placeholder="Contoh: ASP-2403-1234"
            className="font-mono uppercase"
            {...register("sku")}
            error={errors.sku?.message}
            required
            readOnly={isEdit}
          />

          <InputGroup
            label="Nama Item"
            placeholder="Contoh: Oli Yamalube Sport 1L"
            {...register("name")}
            error={errors.name?.message}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Kategori <span className="text-red">*</span>
            </label>
            <div className="flex gap-2">
              <select
                {...register("category_id")}
                className={cn(
                  "flex-1 rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
                  errors.category_id && "!border-red-500 focus:!border-red-500"
                )}
              >
                <option value={0} disabled>
                  Pilih Kategori
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ActionButton
                variant="ghost"
                icon={<Icons.Plus size={18} />}
                className="h-[46px] w-[46px] border-2 border-stroke dark:border-dark-3"
                onClick={() => setShowQuickAdd(true)}
                type="button"
                title="Tambah Kategori baru"
                disabled={!onAddCategory}
              />
            </div>
            {errors.category_id && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.category_id.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Tipe Kendaraan <span className="text-red">*</span>
            </label>
            <select
              {...register("type")}
              className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
            >
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
              <option value="Umum">Umum (Keduanya)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="cost_price"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <InputGroup
                label="Harga Modal (Rp)"
                placeholder="0"
                type="number"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
                value={formatNumber(value)}
                onChange={(e) => onChange(stripFormatting(e.target.value))}
                error={errors.cost_price?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="sell_price"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <InputGroup
                label="Harga Jual (Rp)"
                placeholder="0"
                type="number"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
                className="text-secondary font-bold"
                value={formatNumber(value)}
                onChange={(e) => onChange(stripFormatting(e.target.value))}
                error={errors.sell_price?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Controller
              name="current_stock"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <InputGroup
                  label={isEdit ? "Stok Saat Ini" : "Stok Awal"}
                  placeholder="0"
                  type="number"
                  min={0}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                  value={formatNumber(value)}
                  onChange={(e) => onChange(stripFormatting(e.target.value))}
                  error={errors.current_stock?.message}
                  disabled={isEdit}
                  className={cn(isEdit && "bg-gray-1 dark:bg-dark-3 opacity-70 cursor-not-allowed font-bold text-dark-5")}
                  {...field}
                />
              )}
            />
            {isEdit && (
              <p className="text-[10px] text-dark-5 italic leading-tight px-1">
                * Update stok via menu <strong>Pergerakan Stok</strong>
              </p>
            )}
          </div>
          <Controller
            name="minimum_stock"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <InputGroup
                label="Min. Stok"
                placeholder="5"
                type="number"
                min={0}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                value={formatNumber(value)}
                onChange={(e) => onChange(stripFormatting(e.target.value))}
                error={errors.minimum_stock?.message}
                {...field}
              />
            )}
          />
          <div className="col-span-1">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                Satuan <span className="text-red">*</span>
              </label>
              <select
                {...register("unit")}
                className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
              >
                {(() => {
                  const saved = typeof window !== "undefined" ? localStorage.getItem("master_units") : null;
                  const unitList = saved ? JSON.parse(saved).map((u: any) => u.name) : ["pcs", "liter", "set", "unit", "botol", "box"];
                  return unitList.map((u: string) => (
                    <option key={u} value={u}>{u}</option>
                  ));
                })()}
              </select>
            </div>
          </div>
        </div>

        {sellPriceNum > 0 && costPriceNum > 0 && (
          <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 dark:border-secondary/30">
            <p className="text-xs font-bold text-dark-5 dark:text-dark-6">
              Estimasi Margin:{" "}
              <span className="text-secondary text-sm ml-1">
                {formatCurrency(sellPriceNum - costPriceNum)}{" "}
                <span className="text-xs font-medium opacity-70">
                  ({Math.round(((sellPriceNum - costPriceNum) / sellPriceNum) * 100)}%)
                </span>
              </span>
            </p>
          </div>
        )}

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
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Item"}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>

      {showQuickAdd && onAddCategory && (
        <CategoryFormModal
          onClose={() => setShowQuickAdd(false)}
          onSave={async (name) => {
            try {
              const newCat = await onAddCategory(name);
              setValue("category_id", newCat.id);
              setShowQuickAdd(false);
              Notify.toast("Kategori baru berhasil ditambahkan", "success");
            } catch (err: any) {
              Notify.alert("Gagal", err.message || "Gagal menambah kategori", "error");
              throw err;
            }
          }}
        />
      )}
    </BaseModal>
  );
}
