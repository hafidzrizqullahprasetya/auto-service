"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TransactionTable } from "@/components/Bengkel/Kasir";
import { CreateTransactionForm } from "@/components/Bengkel/Kasir";
import { FinancialSummary } from "@/components/Bengkel/Kasir";
import { ItemCard } from "@/components/Bengkel/POS/ItemCard";
import { CartItemRow } from "@/components/Bengkel/POS/CartItem";
import { OrderSummary } from "@/components/Bengkel/POS/OrderSummary";
import { InvoiceModal } from "@/components/Bengkel/Kasir";
import { MOCK_ITEMS, Item } from "@/mock/inventory";
import { Transaction } from "@/mock/transactions";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";

type Tab = "riwayat" | "buat" | "pos";

interface CartState {
  item: Item;
  quantity: number;
}

export default function KasirPage() {
  const [activeTab, setActiveTab] = useState<Tab>("riwayat");

  // POS State
  const [cart, setCart] = useState<CartState[]>([]);
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Create Transaction State
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredItems = MOCK_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.item.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, current) => acc + current.item.price * current.quantity,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = () => {
    const newTx: Transaction = {
      id: "new-tx-" + Date.now(),
      invoiceNo: `INV/${dayjs().format("YYYYMMDD")}/${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString(),
      customerName: "Pelanggan Umum",
      vehiclePlate: "—",
      items: cart.map((c) => ({
        name: c.item.name,
        price: c.item.price,
        qty: c.quantity,
      })),
      subtotal,
      tax,
      total,
      paymentMethod: "Cash",
      type: cart.some((c) => c.item.category === "Service") ? "Service" : "Sparepart Only",
      paymentStatus: "Lunas",
    };
    setLastTransaction(newTx);
    setShowReceipt(true);
    setCart([]);
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
      <div className="mb-6 flex gap-1 rounded-xl border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-gray-dark w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold",
              activeTab === id
                ? "bg-secondary text-white"
                : "text-dark-5 hover:text-dark dark:hover:text-white"
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-dark dark:text-white">Buat Nota Servis Baru</h4>
                <p className="text-sm text-dark-5">Catat transaksi servis lengkap dengan data customer & kendaraan</p>
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
              <Icons.Print size={48} className="mx-auto mb-3 text-dark-5 opacity-20" />
              <p className="font-bold text-dark-5">Klik tombol di atas untuk mulai membuat nota baru</p>
              <p className="mt-1 text-sm text-dark-5">Stok sparepart akan otomatis berkurang saat transaksi disimpan</p>
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
                  <p className="text-dark-5 dark:text-dark-6">Item tidak ditemukan.</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: Keranjang */}
          <div className="col-span-12 xl:col-span-4 rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5 h-fit sticky top-25">
            <h4 className="mb-6 text-xl font-bold text-dark dark:text-white">
              Detail Pesanan
            </h4>

            <div className="mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                  <p className="text-sm text-dark-5 italic">Belum ada item dipilih.</p>
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
          onSave={(data) => {
            console.log("Transaction saved:", data);
            setShowCreateForm(false);
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
