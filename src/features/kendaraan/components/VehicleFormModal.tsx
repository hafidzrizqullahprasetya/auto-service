"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { useState, useEffect, useRef } from "react";
import { customersService } from "@/services/customers.service";
import { Customer } from "@/types/customer";
import InputGroup from "@/components/ui/InputGroup";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Notify } from "@/utils/notify";
import { cn } from "@/lib/utils";
import { formatPlateNumber } from "@/utils/format-plate";

const vehicleSchema = z.object({
  plate_number: z.string().min(3, "No. Polisi minimal 3 karakter"),
  type: z.enum(["Mobil", "Motor"]),
  year: z.coerce.number().optional().or(z.literal(0)),
  brand: z.string().min(2, "Merk wajib diisi"),
  model: z.string().min(2, "Model wajib diisi"),
  color: z.string().optional(),
  customer_id: z.string().min(1, "Pemilik wajib dipilih"),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface VehicleFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

export function VehicleFormModal({
  onClose,
  onSave,
  initialData,
  mode = "create",
  isLoading = false,
}: VehicleFormModalProps) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema) as any,
    defaultValues: {
      plate_number: initialData?.plateNumber ?? "",
      type: initialData?.type ?? "Mobil",
      year: initialData?.year ?? undefined,
      brand: initialData?.brand ?? "",
      model: initialData?.model ?? "",
      color: initialData?.color ?? "",
      customer_id: initialData?.ownerId ?? "",
    },
  });

  // ── Customer search state ────────────────────
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [search, setSearch] = useState(initialData?.ownerName ?? "");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load customers once
  useEffect(() => {
    customersService
      .getAll()
      .then((list) => {
        setCustomers(list);
        setCustomersLoading(false);
        // Pre-fill if editing
        if (initialData?.ownerId) {
          const found = list.find((c) => c.id === initialData.ownerId);
          if (found) {
            setSelectedCustomer(found);
            setSearch(found.name);
          }
        }
      })
      .catch(() => setCustomersLoading(false));
  }, [initialData?.ownerId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setSearch(c.name);
    setValue("customer_id", c.id);
    setDropdownOpen(false);
  };

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<VehicleFormValues> = (data) => {
    onSave({
      plate_number: data.plate_number,
      type: data.type,
      year: data.year || undefined,
      brand: data.brand,
      model: data.model,
      color: data.color,
      customer_id: data.customer_id,
    });
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Data Kendaraan" : "Registrasi Kendaraan Baru"}
      description={
        isEdit
          ? `Ubah informasi teknis untuk unit ${initialData?.plateNumber}`
          : "Daftarkan kendaraan baru ke sistem untuk tracking service book"
      }
      icon={<Icons.KendaraanMobil size={20} />}
      onClose={onClose}
      maxWidth="lg"
      hideFooter
    >
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid) as any} 
        className="space-y-4"
        noValidate
      >
        {/* No. Polisi */}
        <InputGroup
          label="No. Polisi (Plat Nomor)"
          placeholder="Contoh: B 1234 ABC"
          className="uppercase font-bold"
          {...register("plate_number")}
          onChange={(e) => {
            const formatted = formatPlateNumber(e.target.value);
            setValue("plate_number", formatted);
          }}
          error={errors.plate_number?.message}
          required
        />

        {/* Jenis + Tahun */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Jenis Unit <span className="text-red">*</span>
            </label>
            <select
              {...register("type")}
              className={cn(
                "w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-bold text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
                errors.type && "!border-red-500 focus:!border-red-500"
              )}
            >
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs font-medium text-red-500">{errors.type.message}</p>
            )}
          </div>
          <InputGroup
            label="Tahun Produksi"
            placeholder="Contoh: 2022"
            type="number"
            {...register("year")}
            error={errors.year?.message}
          />
        </div>

        {/* Merk + Model */}
        <div className="grid grid-cols-2 gap-4">
          <InputGroup
            label="Merk"
            placeholder="Contoh: Toyota"
            {...register("brand")}
            error={errors.brand?.message}
            required
          />
          <InputGroup
            label="Model / Tipe"
            placeholder="Contoh: Avanza"
            {...register("model")}
            error={errors.model?.message}
            required
          />
        </div>

        <InputGroup
          label="Warna"
          placeholder="Contoh: Putih Metalik"
          {...register("color")}
          error={errors.color?.message}
        />

        {/* Pilih Pemilik */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Pilih Pemilik (Customer) <span className="text-red">*</span>
          </label>

          {customersLoading ? (
            <Skeleton height={42} className="rounded-lg" />
          ) : (
            <div ref={dropdownRef} className="relative">
              {/* Selected badge */}
              {selectedCustomer && (
                <div className="mb-2 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2">
                  <div>
                    <p className="text-sm font-bold text-dark dark:text-white">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-xs font-medium text-dark-5">
                      {selectedCustomer.phone} · ID: {selectedCustomer.id}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                        setSelectedCustomer(null);
                        setSearch("");
                        setValue("customer_id", "");
                    }}
                    className="text-dark-5 hover:text-dark dark:hover:text-white"
                  >
                    <Icons.Plus size={16} className="rotate-45" />
                  </button>
                </div>
              )}

              {/* Search input */}
              {!selectedCustomer && (
                <div className="relative">
                  <Icons.Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5"
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau nomor HP pelanggan..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                    className={cn(
                      "w-full rounded-lg border-2 border-stroke bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-dark outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white",
                      errors.customer_id && "!border-red-500 focus:!border-red-500"
                    )}
                  />
                </div>
              )}

              {/* Dropdown */}
              {dropdownOpen && !selectedCustomer && (
                <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-stroke bg-white shadow-lg dark:border-dark-3 dark:bg-dark-2">
                  {filteredCustomers.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-dark-5">
                      Pelanggan tidak ditemukan
                    </div>
                  ) : (
                    filteredCustomers.slice(0, 20).map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectCustomer(c)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-1 dark:hover:bg-dark-3"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-2 dark:bg-dark-3">
                          <Icons.User size={14} className="text-dark-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-dark dark:text-white">
                            {c.name}
                          </p>
                          <p className="text-xs text-dark-5">{c.phone}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          {errors.customer_id && (
            <p className="mt-1 text-xs font-medium text-red-500">{errors.customer_id.message}</p>
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
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Daftarkan Unit"}
            disabled={isLoading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
