"use client";

import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { Badge, ActionButton } from "@/components/Bengkel/shared";
import { Customer } from "@/mock/customers";
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-dark-5">Nama Lengkap</label>
              <p className="font-medium text-dark dark:text-white">
                {customer.name}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-dark-5">Nomor WhatsApp</label>
              <div className="flex items-center gap-2">
                <Icons.Whatsapp size={16} className="text-dark-5" />
                <p className="font-medium text-dark dark:text-white">
                  {customer.phone}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-dark-5">Email</label>
              <p className="font-medium text-dark dark:text-white">
                {customer.email || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-dark-5">Alamat</label>
              <p className="font-medium text-dark dark:text-white">
                {customer.address || "-"}
              </p>
            </div>
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
              onClick={() => {}}
            />
          </div>
          {customer.vehicles && customer.vehicles.length > 0 ? (
            <div className="space-y-2">
              {customer.vehicles.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-1 p-3 dark:bg-dark-2"
                >
                  <span className="font-medium text-dark dark:text-white">
                    {v}
                  </span>
                  <div className="flex gap-2">
                    <ActionButton
                      variant="outline"
                      icon={<Icons.Edit size={14} />}
                      onClick={() => {}}
                    />
                    <ActionButton
                      variant="outline"
                      icon={
                        <Icons.Delete size={14} className="text-red-600" />
                      }
                      onClick={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-dark-5">
              Belum ada kendaraan terdaftar
            </p>
          )}
        </section>

        {/* 📊 STATISTIK */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 font-bold text-dark dark:text-white">
            <Icons.Laporan size={18} />
            Statistik
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Total Kunjungan
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {customer.totalVisits}
              </div>
              <div className="text-xs text-blue-500">kali</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="text-sm text-green-600 dark:text-green-400">
                Total Transaksi
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                Rp {formatNumber(customer.totalSpent)}
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Terakhir Datang
              </div>
              <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {customer.lastVisit
                  ? dayjs(customer.lastVisit).format("DD MMM YYYY")
                  : "-"}
              </div>
            </div>
          </div>
        </section>

        {/* 📝 RIWAYAT KUNJUNGAN */}
        <section>
          <h4 className="mb-3 flex items-center gap-2 font-bold text-dark dark:text-white">
            <Icons.History size={18} />
            Riwayat Kunjungan
          </h4>
          <div className="rounded-lg border border-stroke dark:border-dark-3">
            <div className="flex items-center justify-center py-8 text-sm text-dark-5">
              <Icons.History size={24} className="mr-2 opacity-50" />
              Belum ada riwayat kunjungan
            </div>
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <ActionButton variant="ghost" label="Tutup" onClick={onClose} />
          <ActionButton
            variant="primary"
            label="Edit Profil"
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
