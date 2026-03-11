"use client";

import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
import { Customer } from "@/types/customer";
import { formatNumber } from "@/lib/format-number";
import dayjs from "dayjs";

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetailModal({
  customer,
  onClose,
  onEdit,
}: CustomerDetailModalProps) {
  return (
    <BaseModal
      title="Profil Pelanggan"
      description="Informasi lengkap dan riwayat pelanggan"
      icon={<Icons.Pelanggan size={20} />}
      onClose={onClose}
      maxWidth="3xl"
      hideFooter
    >
      <div className="space-y-6">
        {/* 👤 INFORMASI PRIBADI */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 font-bold text-dark dark:text-white">
            <Icons.User size={18} />
            Informasi Pribadi
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Nama Lengkap" value={customer.name} />
            <InfoItem
              label="Nomor WhatsApp"
              value={customer.phone}
              icon={<Icons.Whatsapp size={16} className="text-dark-5" />}
            />
            <InfoItem label="Email" value={customer.email || "-"} />
            <InfoItem label="Alamat" value={customer.address || "-"} />
          </div>
        </section>

        {/* 🚗 KENDARAAN */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-bold text-dark dark:text-white">
              <Icons.KendaraanMobil size={18} />
              Kendaraan Terdaftar
            </h4>
            <ActionButton
              variant="outline"
              label="Tambah"
              icon={<Icons.Plus size={16} />}
              onClick={() => {
                // Future implementation: Link to Add Vehicle
              }}
            />
          </div>
          {customer.vehicles && customer.vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {customer.vehicles.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-1 p-3 dark:bg-dark-2 border border-stroke dark:border-dark-3"
                >
                  <span className="font-bold text-sm text-dark dark:text-white uppercase tracking-wider">
                    {v}
                  </span>
                  <div className="flex gap-1">
                    <ActionButton
                      variant="ghost"
                      icon={<Icons.Edit size={14} />}
                      className="h-8 w-8"
                      onClick={() => {}}
                    />
                    <ActionButton
                      variant="ghost"
                      icon={<Icons.Delete size={14} className="text-red-500" />}
                      className="h-8 w-8"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 rounded-lg border border-dashed border-stroke dark:border-dark-3">
               <p className="text-sm text-dark-5">Belum ada kendaraan terdaftar</p>
            </div>
          )}
        </section>

        {/* 📊 STATISTIK */}
        <section>
          <h4 className="mb-4 flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-dark-5">
            <Icons.Laporan size={14} />
            Statistik Loyalitas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<Icons.History size={18} />}
              label="Kunjungan"
              value={customer.totalVisits}
              unit="Kali"
            />
            <StatCard
              icon={<Icons.Cash size={18} />}
              label="Transaksi"
              value={`Rp ${formatNumber(customer.totalSpent).split(',')[0]}K`}
            />
            <StatCard
              icon={<Icons.Calendar size={18} />}
              label="Terakhir"
              value={customer.lastVisit ? dayjs(customer.lastVisit).format("DD MMM YY") : "-"}
            />
          </div>
        </section>

        {/* 📝 RIWAYAT KUNJUNGAN */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 font-bold text-dark dark:text-white">
            <Icons.History size={18} />
            Riwayat Kunjungan
          </h4>
          <div className="rounded-lg border border-stroke dark:border-dark-3 overflow-hidden bg-gray-1/30 dark:bg-dark-2/30">
            <div className="flex flex-col items-center justify-center py-12 text-sm text-dark-5">
              <Icons.History size={32} className="mb-2 opacity-20" />
              <p className="font-medium">Belum ada riwayat kunjungan tersimpan</p>
              <p className="text-xs">Data riwayat akan muncul otomatis setelah transaksi selesai</p>
            </div>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 border-t border-stroke dark:border-dark-3 pt-6 mt-6">
          <ActionButton variant="ghost" label="Tutup" onClick={onClose} />
          <ActionButton
            variant="primary"
            label="Edit Profil Pelanggan"
            icon={<Icons.Edit size={16} />}
            onClick={() => {
              onClose();
              onEdit(customer);
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-dark-5 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-medium text-dark dark:text-white uppercase">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string | number; unit?: string }) {
  return (
    <div className="rounded-2xl border border-stroke bg-white p-5 dark:border-dark-3 dark:bg-gray-dark shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-2 text-primary dark:bg-dark-3">
          {icon}
        </div>
        <div>
          <h5 className="text-xl font-black tracking-tight text-dark dark:text-white leading-none">
            {value}
            {unit && <span className="ml-1 text-xs font-medium text-dark-5 normal-case">{unit}</span>}
          </h5>
          <p className="mt-1 text-xs font-bold text-dark-5 uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </div>
  );
}
