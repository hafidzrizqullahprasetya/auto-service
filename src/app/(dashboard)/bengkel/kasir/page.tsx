"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ItemCard } from "@/components/Bengkel/POS/ItemCard";
import { CartItemRow } from "@/components/Bengkel/POS/CartItem";
import { OrderSummary } from "@/components/Bengkel/POS/OrderSummary";
import { MOCK_ITEMS, Item } from "@/mock/inventory";
import { standardFormat } from "@/lib/format-number";
import { InvoiceModal } from "@/components/Bengkel/InvoiceModal";
import { Transaction } from "@/mock/transactions";
import dayjs from "dayjs";

interface CartState {
  item: Item;
  quantity: number;
}

export default function KasirPage() {
  const [cart, setCart] = useState<CartState[]>([]);
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const filteredItems = MOCK_ITEMS.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => 
      i.item.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const subtotal = cart.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = () => {
    const newTx: Transaction = {
      id: "new-tx-" + Date.now(),
      invoiceNo: `INV/${dayjs().format("YYYYMMDD")}/${Math.floor(100+Math.random()*900)}`,
      date: new Date().toISOString(),
      customerName: "Pelanggan Umum",
      vehiclePlate: "KEDARAAN-TEST",
      items: cart.map(c => ({
        name: c.item.name,
        price: c.item.price,
        qty: c.quantity
      })),
      subtotal,
      tax,
      total,
      paymentMethod: "Cash",
      type: cart.some(c => c.item.category === "Service") ? "Service" : "Sparepart Only"
    };

    setLastTransaction(newTx);
    setShowReceipt(true);
    setCart([]);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <Breadcrumb pageName="Kasir & POS" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Left Side: Catalog */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-xl font-bold text-dark dark:text-white">
                  Katalog Jasa & Sparepart
                </h4>
                <p className="mt-1 text-sm font-medium text-dark-5">Pilih item untuk ditambahkan ke keranjang</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari item atau scan barcode..."
                  className="w-full rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary sm:w-[250px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map(item => (
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

        {/* Right Side: Cart */}
        <div className="col-span-12 xl:col-span-4 rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5 h-fit sticky top-25">
          <h4 className="mb-6 text-xl font-bold text-dark dark:text-white">
            Detail Pesanan
          </h4>

          <div className="mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.length > 0 ? (
              cart.map(cartItem => (
                <CartItemRow 
                  key={cartItem.item.id} 
                  cartItem={cartItem} 
                  onUpdateQty={updateQty} 
                  onRemove={removeFromCart} 
                />
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-dark-5 dark:text-dark-6 italic">Belum ada item dipilih.</p>
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

      {showReceipt && lastTransaction && (
        <InvoiceModal 
          onClose={() => setShowReceipt(false)} 
          transaction={lastTransaction} 
        />
      )}
    </div>
  );
}
