"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton, CustomSelect } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/types/inventory";
import { formatNumber, stripFormatting } from "@/utils/format-number";
import { useCustomers } from "@/hooks/useCustomers";
import { useInventory } from "@/hooks/useInventory";
import { vehiclesService, ApiVehicle } from "@/services/vehicles.service";
import InputGroup from "@/components/ui/InputGroup";
import { Notify } from "@/utils/notify";
import { Skeleton } from "@/components/ui/skeleton";

const transactionSchema = z.object({
  customerId: z.string().min(1, "Pelanggan wajib dipilih"),
  vehicleId: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        itemId: z.string().nullable(),
        isJasa: z.boolean(),
        name: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        unit: z.string(),
      }),
    )
    .min(1, "Minimal pilih 1 item"),
  paymentMethod: z.string().min(1, "Metode pembayaran wajib dipilih"),
  paymentStatus: z.string().min(1, "Status pembayaran wajib dipilih"),
  paidAmount: z.number().default(0),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormModalProps {
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: {
    customerId?: string;
    vehicleId?: string;
    notes?: string;
    items?: Array<{
      itemId: string;
      isJasa: boolean;
      name: string;
      price: number;
      quantity: number;
      unit: string;
    }>;
  };
}

const DRAFT_KEY = "kasir_transaction_draft";

export function TransactionFormModal({
  onClose,
  onSave,
  initialData,
}: TransactionFormModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: customers } = useCustomers();
  const { data: allItems } = useInventory();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [customerVehicles, setCustomerVehicles] = useState<ApiVehicle[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [jasaSearch, setJasaSearch] = useState("");
  const [itemSearchFocused, setItemSearchFocused] = useState(false);
  const [jasaSearchFocused, setJasaSearchFocused] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [jasaLoading, setJasaLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      customerId: "",
      vehicleId: "",
      notes: "",
      items: [],
      paymentMethod: "",
      paymentStatus: "",
      paidAmount: 0,
    },
  });

  // Load initialData or draft
  useEffect(() => {
    if (initialData) {
      if (initialData.customerId)
        setValue("customerId", initialData.customerId);
      if (initialData.vehicleId) setValue("vehicleId", initialData.vehicleId);
      if (initialData.notes) setValue("notes", initialData.notes);
      if (initialData.items && initialData.items.length > 0) {
        setValue("items", initialData.items);
      }
      return;
    }

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        Object.keys(data).forEach((key) => {
          setValue(key as any, data[key]);
        });
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, [setValue, initialData]);

  const watchAll = watch();
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(watchAll));
  }, [watchAll]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Notify.close();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCustomersLoading(false);
  }, []);

  const {
    fields: cartItems,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "items",
  });

  const customerId = watchAll.customerId;
  const vehicleId = watchAll.vehicleId;
  const paymentStatus = watchAll.paymentStatus;
  const paidAmount = watchAll.paidAmount;

  // Fetch vehicles when customer changes
  useEffect(() => {
    if (!customerId) {
      setCustomerVehicles([]);
      setValue("vehicleId", "");
      return;
    }
    setVehiclesLoading(true);
    vehiclesService
      .getByCustomer(customerId)
      .then((res) => {
        setCustomerVehicles(res);
        setVehiclesLoading(false);
        // Auto-select vehicle if it's in initialData
        if (initialData?.vehicleId) {
          setValue("vehicleId", String(initialData.vehicleId));
        } else if (res.length === 1) {
          // If customer only has 1 vehicle, auto-select it
          setValue("vehicleId", String(res[0].id));
        }
      })
      .catch(() => {
        setCustomerVehicles([]);
        setVehiclesLoading(false);
      });
  }, [customerId, setValue, initialData]);

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const selectedVehicle = customerVehicles.find(
    (v) => v.id === Number(vehicleId),
  );

  const jasaItems = useMemo(
    () => allItems.filter((i) => i.category === "Service"),
    [allItems],
  );
  const sparePartItems = useMemo(
    () => allItems.filter((i) => i.category !== "Service"),
    [allItems],
  );

  const filteredSpareparts = useMemo(
    () =>
      sparePartItems.filter(
        (i) =>
          i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          i.sku.toLowerCase().includes(itemSearch.toLowerCase()),
      ),
    [sparePartItems, itemSearch],
  );

  const filteredJasa = useMemo(
    () =>
      jasaItems.filter(
        (i) =>
          i.name.toLowerCase().includes(jasaSearch.toLowerCase()) ||
          i.sku.toLowerCase().includes(jasaSearch.toLowerCase()),
      ),
    [jasaItems, jasaSearch],
  );

  const addItemToCart = (item: Item) => {
    const existingIndex = cartItems.findIndex(
      (f) => !f.isJasa && f.itemId === item.id,
    );
    if (existingIndex > -1) {
      update(existingIndex, {
        ...cartItems[existingIndex],
        quantity: cartItems[existingIndex].quantity + 1,
      });
    } else {
      append({
        itemId: item.id,
        isJasa: false,
        name: item.name,
        price: item.price,
        quantity: 1,
        unit: item.unit || "pcs",
      });
    }
    setItemSearch("");
  };

  const addJasaToCart = (jasa: Item) => {
    const existingIndex = cartItems.findIndex(
      (f) => f.isJasa && f.itemId === jasa.id,
    );
    if (existingIndex > -1) {
      update(existingIndex, {
        ...cartItems[existingIndex],
        quantity: cartItems[existingIndex].quantity + 1,
      });
    } else {
      append({
        itemId: jasa.id,
        isJasa: true,
        name: jasa.name,
        price: jasa.price,
        quantity: 1,
        unit: "jasa",
      });
    }
    setJasaSearch("");
  };

  const subtotal = watchAll.items.reduce(
    (sum, ci) => sum + ci.price * ci.quantity,
    0,
  );
  const sisa = subtotal - paidAmount;


  const onInvalid = (errors: any) => {
    // We'll handle payment alerts specifically during submit
    if (errors.items) {
      Notify.alert(
        "Item Belum Lengkap",
        "Minimal tambahkan 1 item produk atau jasa",
        "error",
      );
      return;
    }
    
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
    if (step === 1) {
      if (cartItems.length > 0) setStep(2);
      return;
    }
    try {
      setLoading(true);
      await onSave({
        ...data,
        subtotal,
        paidAmount: data.paymentStatus === "Lunas" ? subtotal : data.paidAmount,
      });
      Notify.toast("Transaksi berhasil disimpan!", "success", "top");
      localStorage.removeItem(DRAFT_KEY);
      router.refresh();
      router.push("?tab=riwayat", { scroll: false });
      onClose();
    } catch (error: any) {
      Notify.alert("Gagal!", error.message || "Gagal menyimpan transaksi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      title="Buat Transaksi Baru"
      description="Catat nota servis dan kurangi stok sparepart secara otomatis"
      icon={<Icons.Kasir size={20} />}
      onClose={onClose}
      maxWidth="4xl"
      hideFooter
    >
      <form
        onSubmit={handleSubmit(onFormSubmit, onInvalid) as any}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
              if (step === 1) {
                e.preventDefault();
                if (watchAll.customerId && cartItems.length > 0) {
                  setStep(2);
                }
              } else {
                e.preventDefault();
              }
            }
          }
        }}
        className="space-y-6"
        noValidate
      >
        {step === 1 ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <CustomSelect
                label="Pelanggan"
                placeholder="— Pilih Pelanggan —"
                required
                loading={customersLoading}
                value={customerId}
                onChange={(id) => setValue("customerId", String(id))}
                options={customers.map((c) => ({
                  id: c.id,
                  label: c.name,
                  sublabel: c.phone,
                }))}
                error={errors.customerId?.message}
              />

              {customerId && (
                <CustomSelect
                  label="Kendaraan"
                  placeholder="— Pilih Kendaraan —"
                  loading={vehiclesLoading}
                  value={vehicleId}
                  onChange={(id) => setValue("vehicleId", String(id))}
                  options={customerVehicles.map((v) => ({
                    id: v.id,
                    label: v.plate_number,
                    sublabel: `${v.brand} ${v.model} (${v.year})`,
                  }))}
                />
              )}

              <InputGroup
                label="Tambah Item / Sparepart"
                placeholder="Cari nama atau SKU..."
                leftIcon={<Icons.Search size={16} />}
                value={itemSearch}
                handleChange={(e) => {
                  setItemSearch(e.target.value);
                  setItemsLoading(true);
                  setTimeout(() => setItemsLoading(false), 300);
                }}
                onFocus={() => setItemSearchFocused(true)}
                onBlur={() =>
                  setTimeout(() => setItemSearchFocused(false), 200)
                }
              />

              {(itemSearch || itemSearchFocused) && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                  {itemsLoading ? (
                    <div className="space-y-2 p-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : filteredSpareparts.length > 0 ? (
                    filteredSpareparts.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addItemToCart(item);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-gray-1 dark:hover:bg-dark-3"
                      >
                        <div>
                          <span className="font-mono text-[10px] text-dark-5">
                            {item.sku}
                          </span>
                          {" · "}
                          <span className="font-medium text-dark dark:text-white">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-secondary">
                          Rp {formatNumber(item.price)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-dark-5">
                      Tidak ada sparepart yang cocok
                    </div>
                  )}
                </div>
              )}

              <InputGroup
                label="Tambah Jasa / Layanan"
                placeholder="Cari nama jasa..."
                leftIcon={<Icons.Search size={16} />}
                value={jasaSearch}
                handleChange={(e) => {
                  setJasaSearch(e.target.value);
                  setJasaLoading(true);
                  setTimeout(() => setJasaLoading(false), 300);
                }}
                onFocus={() => setJasaSearchFocused(true)}
                onBlur={() =>
                  setTimeout(() => setJasaSearchFocused(false), 200)
                }
              />

              {(jasaSearch || jasaSearchFocused) && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                  {jasaLoading ? (
                    <div className="space-y-2 p-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 rounded-lg" />
                      ))}
                    </div>
                  ) : filteredJasa.length > 0 ? (
                    filteredJasa.map((jasa) => (
                      <button
                        key={jasa.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addJasaToCart(jasa);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-gray-1 dark:hover:bg-dark-3"
                      >
                        <div>
                          <span className="font-mono text-[10px] text-dark-5">
                            {jasa.sku}
                          </span>
                          {" · "}
                          <span className="font-medium text-dark dark:text-white">
                            {jasa.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-secondary">
                          Rp {formatNumber(jasa.price)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-dark-5">
                      Tidak ada jasa yang cocok
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                  Catatan
                </label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  placeholder="Keluhan, catatan mekanik, dll..."
                  className="w-full resize-none rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-dark dark:text-white">
                Keranjang ({cartItems.length} item)
              </p>
              {cartItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-stroke py-12 text-center dark:border-dark-3">
                  <Icons.Kasir
                    size={40}
                    className="mb-2 text-dark-5 opacity-30"
                  />
                  <p className="text-sm italic text-dark-5">
                    Belum ada item dipilih.
                  </p>
                  {errors.items && (
                    <p className="mt-2 text-xs font-bold text-red-500">
                      {errors.items.message}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex max-h-[400px] flex-col gap-2 overflow-y-auto pr-1">
                  {cartItems.map((ci, idx) => (
                    <div
                      key={ci.id}
                      className="flex items-center gap-3 rounded-lg border border-stroke bg-white p-3 dark:border-dark-3 dark:bg-dark-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-dark dark:text-white">
                          {ci.name}
                        </p>
                        <p className="text-xs text-dark-5">
                          Rp {formatNumber(ci.price)} / {ci.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            update(idx, {
                              ...ci,
                              quantity: Math.max(1, ci.quantity - 1),
                            })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-stroke text-sm font-bold hover:bg-gray-1 dark:border-dark-3"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">
                          {ci.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            update(idx, { ...ci, quantity: ci.quantity + 1 })
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-stroke text-sm font-bold hover:bg-gray-1 dark:border-dark-3"
                        >
                          +
                        </button>
                      </div>
                      <p className="w-24 text-right text-sm font-bold text-secondary">
                        Rp {formatNumber(ci.price * ci.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Icons.Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mt-auto rounded-xl border border-secondary/30 bg-secondary/5 p-4">
                  <div className="flex justify-between text-sm font-medium text-dark-5">
                    <span>Subtotal</span>
                    <span>Rp {formatNumber(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-black">
                    <span className="text-dark dark:text-white">TOTAL</span>
                    <span className="text-xl text-secondary">
                      Rp {formatNumber(subtotal)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-xl border-2 border-stroke bg-gray-1 p-5 dark:border-dark-3 dark:bg-dark-2">
              <p className="mb-4 text-xs font-black uppercase tracking-wider text-dark-5">
                Ringkasan Pesanan
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-5">Pelanggan:</span>
                  <span className="font-bold">
                    {selectedCustomer?.name || "-"}
                  </span>
                </div>
                {selectedVehicle && (
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-5">Kendaraan:</span>
                    <span className="font-bold">
                      {selectedVehicle.plate_number}
                    </span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-stroke pt-3 font-bold dark:border-dark-3">
                  <span className="text-base">Total Tagihan:</span>
                  <span className="text-2xl text-secondary">
                    Rp {formatNumber(subtotal)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold">Metode Pembayaran</label>
              <div className="grid grid-cols-4 gap-2">
                {["Cash", "Transfer", "E-Wallet", "Card"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setValue("paymentMethod", m, { shouldValidate: true })}
                    className={`rounded-lg border-2 py-3 text-sm font-bold transition-all ${
                      watchAll.paymentMethod === m
                        ? "border-secondary bg-secondary text-white"
                        : errors.paymentMethod 
                          ? "border-red-500 bg-red-50 text-red-500 hover:border-red-600"
                          : "border-stroke text-dark-5 hover:border-secondary/50 dark:border-dark-3"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-xs font-bold text-red-500 mt-1">
                  * {errors.paymentMethod.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold">Status Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {["Lunas", "DP", "Piutang"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setValue("paymentStatus", s, { shouldValidate: true });
                      if (s === "Lunas") {
                        setValue("paidAmount", subtotal);
                      } else if (s === "Piutang") {
                        setValue("paidAmount", 0);
                      }
                    }}
                    className={`rounded-lg border-2 py-3 text-sm font-bold transition-all ${
                      watchAll.paymentStatus === s
                        ? "border-secondary bg-secondary text-white"
                        : errors.paymentStatus
                          ? "border-red-500 bg-red-50 text-red-500 hover:border-red-600"
                          : "border-stroke text-dark-5 hover:border-secondary/50 dark:border-dark-3"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.paymentStatus && (
                <p className="text-xs font-bold text-red-500 mt-1">
                  * {errors.paymentStatus.message}
                </p>
              )}
            </div>

            {paymentStatus === "DP" && (
              <div>
                <InputGroup
                  label={
                    paymentStatus === "DP"
                      ? "Jumlah DP (Bayar Sekarang)"
                      : "Sudah Dibayar"
                  }
                  placeholder="0"
                  type="text"
                  inputMode="numeric"
                  leftIcon={
                    <span className="text-sm font-bold text-dark-5">Rp</span>
                  }
                  value={paidAmount === 0 ? "" : formatNumber(paidAmount)}
                  onChange={(e) => {
                    const raw = stripFormatting(e.target.value);
                    setValue("paidAmount", raw, { shouldValidate: true });
                  }}
                  error={errors.paidAmount?.message}
                />
                {paidAmount > 0 && (
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-red/10 bg-red/5 px-4 py-2 text-sm font-bold text-red-500">
                    <span>Sisa Piutang:</span>
                    <span>Rp {formatNumber(Math.max(0, sisa))}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-stroke pt-4 dark:border-dark-3">
          <ActionButton
            variant="ghost"
            label={step === 2 ? "← Kembali" : "Batal"}
            onClick={() => (step === 2 ? setStep(1) : onClose())}
            type="button"
          />
          <div className="flex gap-3">
            {step === 1 ? (
              <ActionButton
                variant="primary"
                label="Lanjut ke Pembayaran →"
                onClick={() => {
                  if (watchAll.customerId && cartItems.length > 0) {
                    setStep(2);
                  } else if (!watchAll.customerId) {
                    Notify.toast("Pilih pelanggan dulu", "warning");
                  } else {
                    Notify.toast("Keranjang masih kosong", "warning");
                  }
                }}
                disabled={cartItems.length === 0}
                type="button"
              />
            ) : (
              <ActionButton
                variant="primary"
                label={loading ? "Menyimpan..." : "Simpan Transaksi"}
                onClick={() => {
                  if (!watchAll.paymentMethod || !watchAll.paymentStatus) {
                    Notify.alert(
                      "Pembayaran Belum Lengkap",
                      "Silakan pilih Metode Pembayaran dan Status Pembayaran terlebih dahulu.",
                      "warning"
                    );
                  }
                  handleSubmit(onFormSubmit, onInvalid)();
                }}
                disabled={loading}
                type="button"
              />
            )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
