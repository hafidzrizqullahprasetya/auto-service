"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/types/inventory";
import { ApiCategory } from "@/types/api";
import { formatNumber, stripFormatting } from "@/utils/format-number";
import InputGroup from "@/components/ui/InputGroup";
import { cn } from "@/lib/utils";
import { Notify } from "@/utils/notify";

const inventorySchema = z.object({
  sku: z.string().optional(),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  category_id: z.coerce.number().min(1, "Kategori wajib dipilih"),
  type: z.string(),
  cost_price: z.string(),
  sell_price: z.string(),
  current_stock: z.string(),
  minimum_stock: z.string(),
  unit: z.string(),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: Item | null;
  categories?: ApiCategory[];
  isLoading?: boolean;
}

export function InventoryFormModal({
  onClose,
  onSave,
  initialData,
  categories = [],
  isLoading = false,
}: InventoryFormModalProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      sku: initialData?.sku ?? "",
      name: initialData?.name ?? "",
      category_id: initialData?.categoryId ?? (categories.length > 0 ? categories[0].id : 0),
      type: initialData?.type ?? "Mobil",
      cost_price: initialData?.costPrice ? formatNumber(initialData.costPrice) : "",
      sell_price: initialData?.price ? formatNumber(initialData.price) : "",
      current_stock: initialData?.stock !== undefined ? formatNumber(initialData.stock) : "",
      minimum_stock: initialData?.minimumStock !== undefined ? formatNumber(initialData.minimumStock) : "5",
      unit: initialData?.unit ?? "pcs",
    },
  });

  const formValues = watch();

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    const formatted = numericValue ? formatNumber(Number(numericValue)) : "";
    setValue(name as any, formatted);
  };

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<InventoryFormValues> = (data) => {
    onSave({
      category_id: Number(data.category_id),
      name: data.name,
      sku: data.sku,
      cost_price: stripFormatting(data.cost_price),
      sell_price: stripFormatting(data.sell_price),
      current_stock: stripFormatting(data.current_stock),
      minimum_stock: stripFormatting(data.minimum_stock),
      unit: data.unit,
      type: data.type,
    });
  };

  const sellPriceNum = stripFormatting(formValues.sell_price);
  const costPriceNum = stripFormatting(formValues.cost_price);

  return (
    <BaseModal
      title={isEdit ? "Edit Item Inventori" : "Tambah Item Inventori"}
      description={
        isEdit
          ? `Edit data dan stok untuk ${initialData?.name}`
          : "Masukkan data sparepart atau jasa baru ke sistem"
      }
      icon={<Icons.Inventory size={20} />}
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
          label="SKU / Kode Barang"
          placeholder="Contoh: OL-SMX-1L"
          className="font-mono uppercase"
          {...register("sku")}
          error={errors.sku?.message}
        />

        <InputGroup
          label="Nama Item / Jasa"
          placeholder="Contoh: Oli Yamalube Sport 1L"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Kategori <span className="text-red">*</span>
            </label>
            <select
              {...register("category_id")}
              className={cn(
                "w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
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
          <InputGroup
            label="Harga Modal (Rp)"
            placeholder="0"
            leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
            {...register("cost_price")}
            onChange={handleNumericChange}
            error={errors.cost_price?.message}
          />
          <InputGroup
            label="Harga Jual (Rp)"
            placeholder="0"
            leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
            className="text-secondary font-bold"
            {...register("sell_price")}
            onChange={handleNumericChange}
            error={errors.sell_price?.message}
          />
        </div>

        {formValues.unit !== "jasa" && (
          <div className="grid grid-cols-3 gap-4">
            <InputGroup
              label="Stok Awal"
              placeholder="0"
              {...register("current_stock")}
              onChange={handleNumericChange}
              error={errors.current_stock?.message}
            />
            <InputGroup
              label="Min. Stok"
              placeholder="5"
              {...register("minimum_stock")}
              onChange={handleNumericChange}
              error={errors.minimum_stock?.message}
            />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                Satuan <span className="text-red">*</span>
              </label>
              <select
                {...register("unit")}
                className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
              >
                <option value="pcs">pcs</option>
                <option value="liter">liter</option>
                <option value="set">set</option>
                <option value="unit">unit</option>
                <option value="jasa">jasa</option>
              </select>
            </div>
          </div>
        )}

        {sellPriceNum > 0 && costPriceNum > 0 && (
          <div className="rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3 dark:border-secondary/30">
            <p className="text-xs font-bold text-dark-5 dark:text-dark-6">
              Estimasi Margin:{" "}
              <span className="text-secondary text-sm ml-1">
                Rp {formatNumber(sellPriceNum - costPriceNum)}{" "}
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
    </BaseModal>
  );
}
