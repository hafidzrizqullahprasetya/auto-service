"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TransactionTable } from "@/features/kasir";
import { CreateTransactionForm } from "@/features/kasir";
import { FinancialSummary } from "@/features/kasir";
import { ItemCard } from "@/features/pos/ItemCard";
import { CartItemRow } from "@/features/pos/CartItem";
import { OrderSummary } from "@/features/pos/OrderSummary";
import { InvoiceModal } from "@/features/kasir";
import { Item } from "@/mock/inventory";
import { Transaction } from "@/mock/transactions";
import { useInventory } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";
import { Notify } from "@/utils/notify";

type Tab = "riwayat" | "buat" | "pos";

interface CartState {
  item: Item;
  quantity: number;
}

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<Tab>("riwayat");
  const { data: allItems } = useInventory();

  // POS State
  const [cart, setCart] = useState<CartState[]>([]);
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null,
  );

  // Create Transaction State
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredItems = allItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.item.id === id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i,
      ),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, current) => acc + current.item.price * current.quantity,
    0,
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      Notify.loading("Memproses pembayaran...");

      if (cart.length === 0) {
        throw new Error("Keranjang kosong!");
      }
      throw new Error("Gunakan fitur 'Buat Nota Servis' untuk mencatat pelanggan dan kendaraan.");
      
    } catch (err: any) {
      const errorMsg = err instanceof Error ? err.message : "Gagal memproses pembayaran";
      Notify.alert("Gagal!", errorMsg);
    }
  };

  const TABS = [
    { id: "riwayat" as Tab, label: "Riwayat Transaksi", icon: Icons.Database },
    { id: "buat" as Tab, label: "Buat Nota Servis", icon: Icons.Print },
    { id: "pos" as Tab, label: "POS Cepat", icon: Icons.Kasir },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Kasir & Transaksi" />

      {/* Tab Navigation */}
      <div className="mb-6 flex w-fit gap-1 rounded-xl border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-gray-dark">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
              activeTab === id
                ? "bg-secondary text-white"
                : "text-dark-5 hover:text-dark dark:hover:text-white",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Riwayat */}
      {activeTab === "riwayat" && (
        <div className="flex flex-col gap-6">
          <FinancialSummary />
          <TransactionTable />
        </div>
      )}

      {/* Tab: Buat Nota Servis */}
      {activeTab === "buat" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-dark dark:text-white">
                  Buat Nota Servis Baru
                </h4>
                <p className="text-sm text-dark-5">
                  Catat transaksi servis lengkap dengan data customer &
                  kendaraan
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white hover:bg-opacity-90"
              >
                <Icons.Plus size={18} />
                Buat Transaksi Baru
              </button>
            </div>

            <div className="rounded-xl border-2 border-dashed border-stroke bg-gray-1 py-20 text-center dark:border-dark-3 dark:bg-dark-2">
              <Icons.Print
                size={48}
                className="mx-auto mb-3 text-dark-5 opacity-20"
              />
              <p className="font-bold text-dark-5">
                Klik tombol di atas untuk mulai membuat nota baru
              </p>
              <p className="mt-1 text-sm text-dark-5">
                Stok sparepart akan otomatis berkurang saat transaksi disimpan
              </p>
            </div>
          </div>

          {/* Riwayat recent */}
          <TransactionTable />
        </div>
      )}

      {/* Tab: POS Cepat */}
      {activeTab === "pos" && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Kiri: Katalog */}
          <div className="col-span-12 xl:col-span-8">
            <div className="rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-xl font-bold text-dark dark:text-white">
                    Katalog Jasa & Sparepart
                  </h4>
                  <p className="mt-1 text-sm font-medium text-dark-5">
                    Pilih item untuk ditambahkan ke keranjang
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari item atau scan barcode..."
                    className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 sm:w-[250px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} onAdd={addToCart} />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-dark-5 dark:text-dark-6">
                    Item tidak ditemukan.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: Keranjang */}
          <div className="sticky top-25 col-span-12 h-fit rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5 xl:col-span-4">
            <h4 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Detail Pesanan
            </h4>

            <div className="custom-scrollbar mb-10 max-h-[400px] overflow-y-auto pr-2">
              {cart.length > 0 ? (
                cart.map((cartItem) => (
                  <CartItemRow
                    key={cartItem.item.id}
                    cartItem={cartItem}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart}
                  />
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-sm italic text-dark-5">
                    Belum ada item dipilih.
                  </p>
                </div>
              )}
            </div>

            <OrderSummary
              subtotal={subtotal}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateForm && (
        <CreateTransactionForm
          onClose={() => setShowCreateForm(false)}
          onSave={async (data) => {
            try {
              if (!data.customerId || !data.vehicleId) {
                Notify.alert("Gagal!", "Pelanggan dan kendaraan wajib dipilih!");
                return;
              }
              if (data.items.length === 0) {
                Notify.alert("Gagal!", "Keranjang tidak boleh kosong!");
                return;
              }

              Notify.loading("Menyimpan transaksi...");
              const { api } = await import("@/lib/api");
              
              const payload = {
                customer_id: data.customerId,
                vehicle_id: data.vehicleId,
                transaction_date: new Date().toISOString(),
                payment_method: data.paymentMethod,
                payment_status: data.paymentStatus === "Lunas" ? "lunas" : "belum_bayar",
                notes: data.notes || undefined,
                items: data.items.map((cartItem: any) => ({
                  item_type: cartItem.isJasa ? "jasa" : "spare_part",
                  spare_part_id: cartItem.isJasa ? null : cartItem.item.id,
                  item_name: cartItem.isJasa ? cartItem.jasaName : cartItem.item.name,
                  quantity: cartItem.quantity,
                  unit_price: cartItem.isJasa ? cartItem.jasaPrice : cartItem.item.price
                }))
              };

              const res = await api.post<any>("/api/v1/transactions", payload);
              
              if (res.data) {
                Notify.toast("Transaksi berhasil disimpan!", "success", "top");
                setShowCreateForm(false);
                // Can trigger reload of transactions logic here
              }
            } catch (err: any) {
              const errorMsg = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan transaksi";
              Notify.alert("Gagal Menyimpan!", errorMsg);
            }
          }}
        />
      )}

      {showReceipt && lastTransaction && (
        <InvoiceModal
          onClose={() => setShowReceipt(false)}
          transaction={lastTransaction}
        />
      )}
    </div>
  );
}
