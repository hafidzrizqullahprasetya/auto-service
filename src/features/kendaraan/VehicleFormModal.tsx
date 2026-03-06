"use client";

import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
import { useState, useEffect, useRef } from "react";
import { customersService } from "@/services/customers.service";
import { Customer } from "@/mock/customers";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  // ── Form state ───────────────────────────────
  const [plateNumber, setPlateNumber] = useState(
    initialData?.plateNumber ?? "",
  );
  const [type, setType] = useState<"Mobil" | "Motor">(
    initialData?.type ?? "Mobil",
  );
  const [year, setYear] = useState(
    initialData?.year ? String(initialData.year) : "",
  );
  const [brand, setBrand] = useState(initialData?.brand ?? "");
  const [model, setModel] = useState(initialData?.model ?? "");
  const [color, setColor] = useState(initialData?.color ?? "");

  // ── Customer search state ────────────────────
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [search, setSearch] = useState(initialData?.ownerName ?? "");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
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
    setDropdownOpen(false);
  };

  const handleSave = () => {
    onSave({
      plate_number: plateNumber,
      type,
      year: year ? Number(year) : undefined,
      brand,
      model,
      color,
      customer_id: selectedCustomer?.id,
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
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={isLoading}
          />
          <ActionButton
            variant="primary"
            label={
              isLoading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Daftarkan Unit"
            }
            onClick={handleSave}
            disabled={isLoading}
          />
        </div>
      }
    >
      <div className="space-y-4">
        {/* No. Polisi */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            No. Polisi (Plat Nomor)
          </label>
          <input
            type="text"
            placeholder="Contoh: B 1234 ABC"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold uppercase text-secondary outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        {/* Jenis + Tahun */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Jenis Unit
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "Mobil" | "Motor")}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Tahun Produksi
            </label>
            <input
              type="number"
              placeholder="Contoh: 2022"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Merk + Model */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Merk
            </label>
            <input
              type="text"
              placeholder="Contoh: Toyota"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">
              Model / Tipe
            </label>
            <input
              type="text"
              placeholder="Contoh: Avanza"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Warna */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Warna
          </label>
          <input
            type="text"
            placeholder="Contoh: Putih Metalik"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Pilih Pemilik */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">
            Pilih Pemilik (Customer)
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
                    className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-9 pr-4 text-sm font-medium text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
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
        </div>
      </div>
    </BaseModal>
  );
}
