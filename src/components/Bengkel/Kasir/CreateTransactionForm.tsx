"use client";

import { useState, useMemo } from "react";
import { BaseModal } from "@/components/Bengkel/shared";
import { ActionButton } from "@/components/Bengkel/shared";
import { Badge } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { MOCK_ITEMS, Item } from "@/mock/inventory";
import { MOCK_CUSTOMERS } from "@/mock/customers";
import { MOCK_VEHICLES } from "@/mock/vehicles";
import { formatNumber } from "@/lib/format-number";

interface CartItem {
  item: Item | null;
  isJasa: boolean;
  jasaName: string;
  jasaPrice: number;
  quantity: number;
}

interface CreateTransactionFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CreateTransactionForm({ onClose, onSave }: CreateTransactionFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Lunas");
  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");

  // Item search
  const [itemSearch, setItemSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Jasa manual
  const [addingJasa, setAddingJasa] = useState(false);
  const [jasaName, setJasaName] = useState("");
  const [jasaPrice, setJasaPrice] = useState(0);

  const selectedCustomer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
  const customerVehicles = MOCK_VEHICLES.filter((v) => v.ownerId === customerId);
  const selectedVehicle = MOCK_VEHICLES.find((v) => v.id === vehicleId);

  const filteredItems = useMemo(
    () =>
      MOCK_ITEMS.filter(
        (i) =>
          i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
          i.sku.toLowerCase().includes(itemSearch.toLowerCase())
      ),
    [itemSearch]
  );

  const addItemToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((ci) => !ci.isJasa && ci.item?.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          !ci.isJasa && ci.item?.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, isJasa: false, jasaName: "", jasaPrice: 0, quantity: 1 }];
    });
    setItemSearch("");
  };

  const addJasaToCart = () => {
    if (!jasaName || jasaPrice <= 0) return;
    setCart((prev) => [
      ...prev,
      { item: null, isJasa: true, jasaName, jasaPrice, quantity: 1 },
    ]);
    setJasaName("");
    setJasaPrice(0);
    setAddingJasa(false);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index: number, qty: number) => {
    setCart((prev) =>
      prev.map((ci, i) => (i === index ? { ...ci, quantity: Math.max(1, qty) } : ci))
    );
  };

  const subtotal = cart.reduce((sum, ci) => {
    const price = ci.isJasa ? ci.jasaPrice : (ci.item?.price ?? 0);
    return sum + price * ci.quantity;
  }, 0);

  const sisa = subtotal - paidAmount;

  const handleSave = () => {
    onSave({
      customerId,
      vehicleId,
      items: cart,
      subtotal,
      paymentMethod,
      paymentStatus,
      paidAmount: paymentStatus === "Lunas" ? subtotal : paidAmount,
      notes,
    });
    onClose();
  };

  return (
    <BaseModal
      title="Buat Transaksi Baru"
      description="Catat nota servis dan kurangi stok sparepart secara otomatis"
      icon={<Icons.Kasir size={20} />}
      onClose={onClose}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <ActionButton variant="ghost" label="← Kembali" onClick={() => setStep(1)} />
            )}
          </div>
          <div className="flex items-center gap-3">
            <ActionButton variant="ghost" label="Batal" onClick={onClose} />
            {step === 1 ? (
              <ActionButton
                variant="primary"
                label="Lanjut ke Pembayaran →"
                onClick={() => setStep(2)}
                disabled={cart.length === 0}
              />
            ) : (
              <ActionButton
                variant="primary"
                label="Simpan Transaksi"
                onClick={handleSave}
                disabled={!customerId}
              />
            )}
          </div>
        </div>
      }
    >
      {step === 1 ? (
        // --- STEP 1: Pilih customer & item ---
        <div className="grid grid-cols-2 gap-6">
          {/* Kiri: Pilih customer & item */}
          <div className="space-y-4">
            {/* Customer */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Pelanggan</label>
              <select
                value={customerId}
                onChange={(e) => { setCustomerId(e.target.value); setVehicleId(""); }}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              >
                <option value="">— Pilih Pelanggan —</option>
                {MOCK_CUSTOMERS.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} · {c.phone}</option>
                ))}
              </select>
            </div>

            {/* Kendaraan */}
            {customerId && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-dark dark:text-white">Kendaraan</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                >
                  <option value="">— Pilih Kendaraan —</option>
                  {customerVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} — {v.brand} {v.model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Cari Item */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Tambah Item / Sparepart</label>
              <div className="relative">
                <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
                <input
                  type="text"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  placeholder="Cari nama atau SKU..."
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                />
              </div>

              {itemSearch && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-stroke dark:border-dark-3">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => addItemToCart(item)}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-gray-1 dark:hover:bg-dark-3"
                    >
                      <div>
                        <span className="font-mono text-[10px] text-dark-5">{item.sku}</span>
                        {" · "}
                        <span className="font-medium text-dark dark:text-white">{item.name}</span>
                      </div>
                      <span className="font-bold text-secondary text-xs">
                        Rp {formatNumber(item.price)}
                      </span>
                    </button>
                  ))}
                  {filteredItems.length === 0 && (
                    <p className="py-3 text-center text-sm text-dark-5">Tidak ditemukan</p>
                  )}
                </div>
              )}
            </div>

            {/* Tambah Jasa Manual */}
            {!addingJasa ? (
              <button
                onClick={() => setAddingJasa(true)}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <Icons.Plus size={14} /> Tambah Jasa Manual
              </button>
            ) : (
              <div className="rounded-lg border border-stroke p-4 space-y-3 dark:border-dark-3">
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
                  <ActionButton variant="primary" label="Tambah" onClick={addJasaToCart} />
                  <ActionButton variant="ghost" label="Batal" onClick={() => setAddingJasa(false)} />
                </div>
              </div>
            )}

            {/* Catatan */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">
                Catatan <span className="font-normal text-dark-5">(opsional)</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keluhan, catatan mekanik, dll..."
                className="w-full resize-none rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
          </div>

          {/* Kanan: Keranjang */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-dark dark:text-white">
              Keranjang ({cart.length} item)
            </p>
            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-stroke py-12 text-center dark:border-dark-3">
                <Icons.Kasir size={40} className="mb-2 text-dark-5 opacity-30" />
                <p className="text-sm text-dark-5">Belum ada item</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {cart.map((ci, idx) => {
                  const name = ci.isJasa ? ci.jasaName : ci.item?.name ?? "";
                  const price = ci.isJasa ? ci.jasaPrice : (ci.item?.price ?? 0);
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-lg border border-stroke p-3 dark:border-dark-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-bold text-dark dark:text-white">{name}</p>
                        <p className="text-xs text-dark-5">Rp {formatNumber(price)} / {ci.isJasa ? "jasa" : (ci.item?.unit ?? "pcs")}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(idx, ci.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded border border-stroke font-bold text-sm hover:bg-gray-1 dark:border-dark-3">−</button>
                        <span className="w-6 text-center text-sm font-black">{ci.quantity}</span>
                        <button onClick={() => updateQty(idx, ci.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded border border-stroke font-bold text-sm hover:bg-gray-1 dark:border-dark-3">+</button>
                      </div>
                      <p className="w-24 text-right text-sm font-black text-secondary">
                        Rp {formatNumber(price * ci.quantity)}
                      </p>
                      <button onClick={() => removeFromCart(idx)} className="text-red-400 hover:text-red-600">
                        <Icons.Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            {cart.length > 0 && (
              <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
                <div className="flex justify-between text-sm text-dark-5">
                  <span>Subtotal</span>
                  <span className="font-bold text-dark dark:text-white">Rp {formatNumber(subtotal)}</span>
                </div>
                <div className="mt-3 flex justify-between font-black">
                  <span className="text-dark dark:text-white">TOTAL</span>
                  <span className="text-lg text-secondary">Rp {formatNumber(subtotal)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // --- STEP 2: Pembayaran ---
        <div className="mx-auto max-w-md space-y-5">
          {/* Ringkasan */}
          <div className="rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
            <p className="text-xs font-bold uppercase text-dark-5">Ringkasan Transaksi</p>
            {selectedCustomer && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-dark-5">Pelanggan:</span>
                <span className="text-sm font-bold text-dark dark:text-white">{selectedCustomer.name}</span>
              </div>
            )}
            {selectedVehicle && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-5">Kendaraan:</span>
                <span className="text-sm font-bold text-dark dark:text-white">{selectedVehicle.plateNumber}</span>
              </div>
            )}
            <div className="mt-2 border-t border-stroke pt-2 dark:border-dark-3 flex items-center justify-between">
              <span className="text-sm font-bold text-dark dark:text-white">Total Tagihan:</span>
              <span className="text-lg font-black text-secondary">Rp {formatNumber(subtotal)}</span>
            </div>
          </div>

          {/* Metode Bayar */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Metode Pembayaran</label>
            <div className="grid grid-cols-4 gap-2">
              {["Cash", "Transfer", "E-Wallet", "Card"].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`rounded-lg border py-2 text-xs font-bold ${
                    paymentMethod === m
                      ? "border-secondary bg-secondary text-white"
                      : "border-stroke text-dark-5 hover:border-secondary dark:border-dark-3"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Status Bayar */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Status Pembayaran</label>
            <div className="grid grid-cols-3 gap-2">
              {["Lunas", "DP", "Piutang"].map((s) => (
                <button
                  key={s}
                  onClick={() => setPaymentStatus(s)}
                  className={`rounded-lg border py-2 text-xs font-bold ${
                    paymentStatus === s
                      ? "border-secondary bg-secondary text-white"
                      : "border-stroke text-dark-5 hover:border-secondary dark:border-dark-3"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* DP Amount */}
          {(paymentStatus === "DP") && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-dark dark:text-white">Jumlah DP (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">Rp</span>
                <input
                  type="number"
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-stroke bg-transparent pl-12 pr-4 py-2.5 text-sm font-black text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
                />
              </div>
              {paidAmount > 0 && (
                <p className="text-xs text-dark-5">
                  Sisa: <span className="font-bold text-secondary">Rp {formatNumber(Math.max(0, sisa))}</span>
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </BaseModal>
  );
}
