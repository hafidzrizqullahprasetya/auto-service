"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Item } from "@/types/inventory";
import { formatNumber } from "@/lib/format-number";
import { useCustomers } from "@/hooks/useCustomers";
import { useInventory } from "@/hooks/useInventory";
import { vehiclesService, ApiVehicle } from "@/services/vehicles.service";
import InputGroup from "@/components/ui/InputGroup";

const transactionSchema = z.object({
  customerId: z.string().min(1, "Pelanggan wajib dipilih"),
  vehicleId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string().nullable(),
    isJasa: z.boolean(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().min(1),
    unit: z.string(),
  })).min(1, "Minimal pilih 1 item"),
  paymentMethod: z.string().default("Cash"),
  paymentStatus: z.string().default("Lunas"),
  paidAmount: z.number().default(0),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface CreateTransactionFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateTransactionForm({
  onClose,
  onSave,
}: CreateTransactionFormProps) {
  const { data: customers } = useCustomers();
  const { data: allItems } = useInventory();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [customerVehicles, setCustomerVehicles] = useState<ApiVehicle[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [addingJasa, setAddingJasa] = useState(false);
  const [jasaName, setJasaName] = useState("");
  const [jasaPrice, setJasaPrice] = useState(0);

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
      paymentMethod: "Cash",
      paymentStatus: "Lunas",
      paidAmount: 0,
    },
  });

  const { fields: cartItems, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  const watchAll = watch();
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
    vehiclesService
      .getByCustomer(customerId)
      .then(setCustomerVehicles)
      .catch(() => setCustomerVehicles([]));
    setValue("vehicleId", "");
  }, [customerId, setValue]);

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const selectedVehicle = customerVehicles.find((v) => v.id === Number(vehicleId));

  const filteredItems = useMemo(
    () =>
      allItems.filter(
        (i) =>
          i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          i.sku.toLowerCase().includes(itemSearch.toLowerCase()),
      ),
    [allItems, itemSearch],
  );

  const addItemToCart = (item: Item) => {
    const existingIndex = cartItems.findIndex((f) => !f.isJasa && f.itemId === item.id);
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

  const addJasaToCart = () => {
    if (!jasaName || jasaPrice <= 0) return;
    append({
      itemId: null,
      isJasa: true,
      name: jasaName,
      price: jasaPrice,
      quantity: 1,
      unit: "jasa",
    });
    setJasaName("");
    setJasaPrice(0);
    setAddingJasa(false);
  };

  const subtotal = watchAll.items.reduce((sum, ci) => sum + ci.price * ci.quantity, 0);
  const sisa = subtotal - paidAmount;

  const onFormSubmit: SubmitHandler<TransactionFormValues> = (data) => {
    onSave({
      ...data,
      subtotal,
      paidAmount: data.paymentStatus === "Lunas" ? subtotal : data.paidAmount,
    });
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
      <form onSubmit={handleSubmit(onFormSubmit) as any} className="space-y-6">
        {step === 1 ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                  Pelanggan <span className="text-red">*</span>
                </label>
                <select
                  {...register("customerId")}
                  className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                >
                  <option value="">— Pilih Pelanggan —</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} · {c.phone}
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
              </div>

              {customerId && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
                    Kendaraan
                  </label>
                  <select
                    {...register("vehicleId")}
                    className="w-full rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                  >
                    <option value="">— Pilih Kendaraan —</option>
                    {customerVehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plate_number} — {v.brand} {v.model}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <InputGroup
                label="Tambah Item / Sparepart"
                placeholder="Cari nama atau SKU..."
                leftIcon={<Icons.Search size={16} />}
                value={itemSearch}
                handleChange={(e) => setItemSearch(e.target.value)}
              />

              {itemSearch && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-stroke bg-white dark:border-dark-3 dark:bg-dark-2">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItemToCart(item)}
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
                  ))}
                </div>
              )}

              {!addingJasa ? (
                <button
                  type="button"
                  onClick={() => setAddingJasa(true)}
                  className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <Icons.Plus size={14} /> Tambah Jasa Manual
                </button>
              ) : (
                <div className="space-y-3 rounded-lg border-2 border-dashed border-stroke p-4 dark:border-dark-3">
                  <p className="text-sm font-bold text-dark dark:text-white">Jasa / Item Custom</p>
                  <input
                    type="text"
                    placeholder="Nama jasa..."
                    value={jasaName}
                    onChange={(e) => setJasaName(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                  />
                  <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={jasaPrice || ""}
                    onChange={(e) => setJasaPrice(Number(e.target.value))}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                  />
                  <div className="flex gap-2">
                    <ActionButton variant="primary" label="Tambah" onClick={addJasaToCart} type="button" />
                    <ActionButton variant="ghost" label="Batal" onClick={() => setAddingJasa(false)} type="button" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Catatan</label>
                <textarea
                  {...register("notes")}
                  rows={2}
                  placeholder="Keluhan, catatan mekanik, dll..."
                  className="w-full resize-none rounded-lg border-2 border-stroke bg-white px-4 py-3 text-sm font-medium text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold text-dark dark:text-white">Keranjang ({cartItems.length} item)</p>
              {cartItems.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-stroke py-12 text-center dark:border-dark-3">
                  <Icons.Kasir size={40} className="mb-2 text-dark-5 opacity-30" />
                  <p className="text-sm italic text-dark-5">Belum ada item dipilih.</p>
                  {errors.items && <p className="mt-2 text-xs text-red-500 font-bold">{errors.items.message}</p>}
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {cartItems.map((ci, idx) => (
                    <div key={ci.id} className="flex items-center gap-3 rounded-lg border border-stroke p-3 bg-white dark:border-dark-3 dark:bg-dark-2 shadow-sm">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-dark dark:text-white">{ci.name}</p>
                        <p className="text-xs text-dark-5">Rp {formatNumber(ci.price)} / {ci.unit}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => update(idx, { ...ci, quantity: Math.max(1, ci.quantity - 1) })}
                          className="flex h-7 w-7 items-center justify-center rounded border border-stroke text-sm font-bold hover:bg-gray-1 dark:border-dark-3"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{ci.quantity}</span>
                        <button
                          type="button"
                          onClick={() => update(idx, { ...ci, quantity: ci.quantity + 1 })}
                          className="flex h-7 w-7 items-center justify-center rounded border border-stroke text-sm font-bold hover:bg-gray-1 dark:border-dark-3"
                        >
                          +
                        </button>
                      </div>
                      <p className="w-24 text-right text-sm font-bold text-secondary">Rp {formatNumber(ci.price * ci.quantity)}</p>
                      <button type="button" onClick={() => remove(idx)} className="text-red-400 hover:text-red-600">
                        <Icons.Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 mt-auto">
                    <div className="flex justify-between text-sm font-medium text-dark-5">
                        <span>Subtotal</span>
                        <span>Rp {formatNumber(subtotal)}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center font-black">
                        <span className="text-dark dark:text-white">TOTAL</span>
                        <span className="text-xl text-secondary">Rp {formatNumber(subtotal)}</span>
                    </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-md space-y-6">
            <div className="rounded-xl border-2 border-stroke bg-gray-1 p-5 dark:border-dark-3 dark:bg-dark-2">
              <p className="text-xs font-black uppercase tracking-wider text-dark-5 mb-4">Ringkasan Pesanan</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-dark-5">Pelanggan:</span>
                    <span className="font-bold">{selectedCustomer?.name || "-"}</span>
                </div>
                {selectedVehicle && (
                   <div className="flex justify-between text-sm">
                       <span className="text-dark-5">Kendaraan:</span>
                       <span className="font-bold">{selectedVehicle.plate_number}</span>
                   </div>
                )}
                <div className="pt-3 mt-3 border-t-2 border-dashed border-stroke dark:border-dark-3 flex justify-between items-center font-bold">
                    <span className="text-base">Total Tagihan:</span>
                    <span className="text-2xl text-secondary">Rp {formatNumber(subtotal)}</span>
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
                    onClick={() => setValue("paymentMethod", m)}
                    className={`rounded-lg border-2 py-3 text-sm font-bold transition-all ${
                      watchAll.paymentMethod === m
                        ? "border-secondary bg-secondary text-white shadow-md scale-105"
                        : "border-stroke text-dark-5 hover:border-secondary/50 dark:border-dark-3"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold">Status Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {["Lunas", "DP", "Piutang"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                        setValue("paymentStatus", s);
                        if (s === "Lunas") setValue("paidAmount", subtotal);
                    }}
                    className={`rounded-lg border-2 py-3 text-sm font-bold transition-all ${
                        watchAll.paymentStatus === s
                        ? "border-secondary bg-secondary text-white shadow-md scale-105"
                        : "border-stroke text-dark-5 hover:border-secondary/50 dark:border-dark-3"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {(paymentStatus === "DP" || paymentStatus === "Piutang") && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <InputGroup
                        label={paymentStatus === "DP" ? "Jumlah DP (Bayar Sekarang)" : "Sudah Dibayar"}
                        placeholder="0"
                        type="number"
                        leftIcon={<span className="text-sm font-bold text-dark-5">Rp</span>}
                        {...register("paidAmount", { valueAsNumber: true })}
                        error={errors.paidAmount?.message}
                    />
                    {paidAmount > 0 && (
                        <div className="mt-3 flex justify-between items-center text-sm font-bold bg-red/5 text-red-500 rounded-lg px-4 py-2 border border-red/10">
                            <span>Sisa Piutang:</span>
                            <span>Rp {formatNumber(Math.max(0, sisa))}</span>
                        </div>
                    )}
                </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-stroke dark:border-dark-3">
          <ActionButton
            variant="ghost"
            label={step === 2 ? "← Kembali" : "Batal"}
            onClick={() => step === 2 ? setStep(1) : onClose()}
            type="button"
          />
          <div className="flex gap-3">
             {step === 1 ? (
                <ActionButton
                  variant="primary"
                  label="Lanjut ke Pembayaran →"
                  onClick={() => {
                      if (cartItems.length > 0) setStep(2);
                  }}
                  disabled={cartItems.length === 0}
                  type="button"
                />
             ) : (
                <ActionButton
                  variant="primary"
                  label="Simpan Transaksi"
                  type="submit"
                />
             )}
          </div>
        </div>
      </form>
    </BaseModal>
  );
}
