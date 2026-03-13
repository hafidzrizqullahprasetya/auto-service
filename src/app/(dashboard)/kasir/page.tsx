"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { TransactionTable } from "@/features/kasir";
import { TransactionFormModal } from "@/features/kasir";
import { TransactionSummary } from "@/features/kasir";
import { ItemCard, CartItemRow, OrderSummary } from "@/features/pos";
import { InvoiceModal } from "@/features/kasir";
import { Item } from "@/types/inventory";
import { Transaction } from "@/types/transaction";
import { useInventory } from "@/hooks/useInventory";
import { useCustomers } from "@/hooks/useCustomers";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";
import { Notify } from "@/utils/notify";
import { CameraScanner } from "@/components/Scanner/CameraScanner";

type Tab = "riwayat" | "buat" | "pos";

interface CartState {
  item: Item;
  quantity: number;
}

export default function KasirPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<Tab>("buat");
  const { data: allItems, loading } = useInventory();
  const { data: customers } = useCustomers();

  useEffect(() => {
    const tabParam = searchParams.get("tab") as Tab | null;
    if (tabParam && ["buat", "pos", "riwayat"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  // POS State
  const [cart, setCart] = useState<CartState[]>([]);
  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null,
  );
  const [posItems, setPosItems] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [taxRate, setTaxRate] = useState(11);

  // Load Settings
  useEffect(() => {
    const { settingsService } = require("@/services/settings.service");
    settingsService.get().then((s: any) => {
      if (s?.tax_percentage !== undefined) setTaxRate(Number(s.tax_percentage));
    });
  }, []);

  // Handle Work Order from URL
  useEffect(() => {
    const woId = searchParams.get("wo_id");
    if (woId && allItems.length > 0 && customers.length > 0) {
      const customerId = searchParams.get("customer_id");
      const customerName = searchParams.get("customer_name");
      const vehicleId = searchParams.get("vehicle_id");
      const plateNumber = searchParams.get("plate_number");
      const layanan = searchParams.get("layanan");
      const biaya = Number(searchParams.get("biaya") || 0);
      const notes = searchParams.get("notes") || "";

      // Fallback: If ID is missing but name exists, find in master data
      let finalCustomerId = customerId;
      if (!finalCustomerId && customerName) {
        const foundC = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
        if (foundC) finalCustomerId = foundC.id;
      }

      let finalVehicleId = vehicleId;
      // We'll let the Modal handle fetching vehicles once Customer ID is set
      
      const items = [];
      if (layanan) {
        items.push({
          itemId: null, // Custom item from WO
          isJasa: true,
          name: layanan,
          price: biaya,
          quantity: 1,
          unit: "jasa"
        });
      }

      setInitialFormData({
        customerId: finalCustomerId,
        vehicleId: finalVehicleId,
        notes: notes,
        items: items
      });
      setShowCreateForm(true);
    }
  }, [searchParams, allItems, customers]);

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
  
  // LOGIC: Total is inclusive of Tax (matches user screenshot and Form logic)
  const total = subtotal;
  const taxFactor = taxRate / 100;
  const tax = Math.round(total - (total / (1 + taxFactor)));

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Notify.alert("Gagal!", "Keranjang kosong!");
      return;
    }
    const items = cart.map((c) => ({
      itemId: c.item.id,
      isJasa: c.item.category === "Service",
      name: c.item.name,
      price: c.item.price,
      quantity: c.quantity,
      unit: c.item.unit || "pcs",
    }));

    setPosItems(items);
    setShowCreateForm(true);
  };

  const TABS = [
    { id: "buat" as Tab, label: "Buat Nota Servis", icon: Icons.Print },
    { id: "pos" as Tab, label: "POS Cepat", icon: Icons.Kasir },
    { id: "riwayat" as Tab, label: "Riwayat Transaksi", icon: Icons.Database },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Kasir & Transaksi" />

      {/* Tab Navigation */}
      <div className="mb-6 flex w-fit gap-1 rounded-xl border border-stroke bg-white p-1 dark:border-dark-3 dark:bg-gray-dark">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
              activeTab === id
                ? "bg-secondary text-white"
                : "text-dark-5 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab: Buat Nota Servis (Utama) */}
      {activeTab === "buat" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-stroke bg-white p-6 dark:border-dark-3 dark:bg-gray-dark">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                className="flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-opacity-90 active:scale-95"
              >
                <Icons.Plus size={20} />
                Buat Transaksi Baru
              </button>
            </div>

            <div className="rounded-xl border-2 border-dashed border-stroke bg-gray-1 py-16 text-center dark:border-dark-3 dark:bg-dark-2">
              <Icons.Print
                size={48}
                className="mx-auto mb-3 text-dark-5 opacity-20"
              />
              <p className="font-bold text-dark dark:text-white">
                Klik tombol di atas untuk mulai membuat nota baru
              </p>
              <p className="mt-1 text-sm text-dark-5">
                Stok sparepart akan otomatis berkurang saat transaksi disimpan
              </p>
            </div>
          </div>

          <div className="mt-2">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-dark dark:text-white">
                Transaksi Hari Ini
              </h4>
              <button
                onClick={() => handleTabChange("riwayat")}
                className="text-sm font-bold text-secondary hover:underline"
              >
                Lihat Semua &rarr;
              </button>
            </div>
            <TransactionTable />
          </div>
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
                <div className="relative flex w-full sm:w-[300px]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Icons.Search size={18} className="text-dark-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama atau scan SKU..."
                    className="w-full rounded-xl border border-stroke bg-gray-1 py-3 pl-11 pr-12 text-sm outline-none transition-all focus:border-secondary focus:bg-white dark:border-dark-3 dark:bg-dark-2 dark:focus:border-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && search) {
                        const exactMatch = allItems.find(
                          (i) => i.sku.toLowerCase() === search.toLowerCase(),
                        );
                        if (exactMatch) {
                          addToCart(exactMatch);
                          setSearch("");
                          Notify.toast("Item ditambahkan", "success", "top");
                        }
                      }
                    }}
                  />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                      onClick={() => setShowScanner(true)}
                      title="Buka Kamera Scanner"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-dark-5 shadow-sm transition-all hover:bg-secondary hover:text-white dark:bg-dark-3 dark:text-dark-6"
                    >
                      <Icons.Barcode size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-lg border border-stroke bg-white overflow-hidden dark:border-dark-3 dark:bg-dark-2"
                    >
                      <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-32 w-full" />
                      <div className="p-4 space-y-3">
                        <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-3 w-12" />
                        <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-4 w-full" />
                        <div className="flex justify-between pt-2">
                          <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-6 w-24" />
                          <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-4 w-10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                      <ItemCard key={item.id} item={item} onAdd={addToCart} />
                    ))}
                  </div>

                  {filteredItems.length === 0 && (
                    <div className="py-20 text-center">
                      <Icons.Search
                        size={48}
                        className="mx-auto mb-3 opacity-10"
                      />
                      <p className="text-dark-5 dark:text-dark-6">
                        Item tidak ditemukan.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Kanan: Keranjang */}
          <div className="sticky top-25 col-span-12 h-fit rounded-[10px] border border-stroke bg-white p-4 dark:border-dark-3 dark:bg-gray-dark sm:p-7.5 xl:col-span-4">
            <div className="mb-6 flex items-center gap-2">
              <Icons.Kasir size={20} className="text-secondary" />
              <h4 className="text-xl font-bold text-dark dark:text-white">
                Keranjang
              </h4>
            </div>

            <div className="custom-scrollbar mb-10 max-h-[400px] overflow-y-auto pr-2">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-stroke py-3 last:border-0 dark:border-dark-3"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-4 w-3/4" />
                        <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-3 w-1/4" />
                      </div>
                      <div className="animate-pulse bg-gray-2 dark:bg-dark-3 h-8 w-16 rounded" />
                    </div>
                  ))}
                </div>
              ) : cart.length > 0 ? (
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
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-1 dark:bg-dark-2">
                    <Icons.Kasir size={24} className="text-dark-5 opacity-20" />
                  </div>
                  <p className="text-sm font-medium text-dark-5">
                    Belum ada item dipilih
                  </p>
                </div>
              )}
            </div>

            {loading ? (
              <div className="rounded-[10px] border border-stroke bg-gray-2 p-4 space-y-4 dark:border-dark-3 dark:bg-dark-3">
                <div className="flex justify-between">
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-4 w-12" />
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-4 w-12" />
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-4 w-20" />
                </div>
                <div className="border-t border-stroke pt-4 flex justify-between dark:border-dark-4">
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-6 w-16" />
                  <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-8 w-32" />
                </div>
                <div className="animate-pulse bg-gray-3 dark:bg-dark-4 h-12 w-full rounded-xl" />
              </div>
            ) : (
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                onCheckout={handleCheckout}
                disabled={cart.length === 0}
              />
            )}
          </div>
        </div>
      )}

      {/* Tab: Riwayat (Audit View) */}
      {activeTab === "riwayat" && (
        <div className="flex flex-col gap-6">
          <TransactionSummary />
          <TransactionTable />
        </div>
      )}

      {/* Modals */}
      {showCreateForm && (
        <TransactionFormModal
          initialData={initialFormData || { items: posItems }}
          onClose={() => {
            setShowCreateForm(false);
            setPosItems([]);
            setInitialFormData(null);

            if (searchParams.get("wo_id")) {
              router.push(pathname, { scroll: false });
            }
          }}
          onSave={async (data: any) => {
            try {
              if (!data.customerId || !data.vehicleId) {
                Notify.alert(
                  "Gagal!",
                  "Pelanggan dan kendaraan wajib dipilih!",
                );
                return;
              }
              if (data.items.length === 0) {
                Notify.alert("Gagal!", "Keranjang tidak boleh kosong!");
                return;
              }

              const loadingId = Notify.loading("Menyimpan transaksi...");
              const { api } = await import("@/lib/api");

              // Get customer and vehicle data for invoice
              const customer = customers.find((c) => c.id === data.customerId);
              
              const payload = {
                customer_id: data.customerId,
                vehicle_id: data.vehicleId,
                transaction_date: new Date().toISOString(),
                payment_method: data.paymentMethod,
                payment_status: 
                  data.paymentStatus === "Lunas" ? "lunas" : 
                  data.paymentStatus === "DP" ? "dp" : "piutang",
                paid_amount: Number(data.paidAmount || 0),
                notes: data.notes || undefined,
                items: data.items.map((cartItem: any) => ({
                  item_type: cartItem.isJasa ? "service" : "spare_part",
                  spare_part_id: cartItem.isJasa ? null : cartItem.itemId,
                  item_name: cartItem.name,
                  quantity: cartItem.quantity,
                  unit_price: cartItem.price,
                })),
              };

              const res = await api.post<any>("/api/v1/transactions", payload);

              Notify.close();

              if (res.data) {
                // Use the central mapping service to ensure consistency
                const { mapTransaction } = await import("@/services/transactions.service");
                const transaction = mapTransaction(res.data, taxRate);
                
                // Force current time for the invoice right after creation
                transaction.date = new Date().toISOString();

                setLastTransaction(transaction);
                setShowReceipt(true);
                setShowCreateForm(false);
                setCart([]); // Clear POS cart
                setPosItems([]); // Clear draft

                Notify.toast("Transaksi berhasil disimpan!", "success", "top");
              }
            } catch (err: any) {
              Notify.close();
              const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Terjadi kesalahan saat menyimpan transaksi";
              Notify.alert("Gagal Menyimpan!", errorMsg);
            }
          }}
        />
      )}

      {showReceipt && lastTransaction && (
        <InvoiceModal
          onClose={() => {
            setShowReceipt(false);
            window.location.href = window.location.pathname + "?tab=riwayat";
          }}
          transaction={lastTransaction}
        />
      )}
      {showScanner && (
        <CameraScanner
          onScan={(sku) => {
            const item = allItems.find(
              (i) => i.sku.toLowerCase() === sku.toLowerCase()
            );
            if (item) {
              addToCart(item);
              Notify.toast(`Berhasil scan: ${item.name}`, "success", "top");
              // Kita tidak tutup scanner supaya bisa scan banyak item sekaligus
            } else {
              Notify.toast(`Barcode tidak dikenal: ${sku}`, "error", "top");
            }
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
