import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { ActionButton } from "@/components/Bengkel/shared";

interface VehicleFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function VehicleFormModal({ onClose, onSave }: VehicleFormModalProps) {
  return (
    <BaseModal
      title="Registrasi Kendaraan Baru"
      description="Daftarkan kendaraan baru ke sistem untuk tracking service book"
      icon={<Icons.KendaraanMobil size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label="Daftarkan Unit" onClick={() => onSave({})} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">No. Polisi (Plat Nomor)</label>
          <input 
            type="text" 
            placeholder="Contoh: B 1234 ABC"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 uppercase font-black tracking-widest text-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Jenis Kendaraan</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Tahun Produksi</label>
            <input 
              type="number" 
              placeholder="Contoh: 2022"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Merk</label>
            <input 
              type="text" 
              placeholder="Contoh: Toyota"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Model / Tipe</label>
            <input 
              type="text" 
              placeholder="Contoh: Avanza"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Warna</label>
          <input 
            type="text" 
            placeholder="Contoh: Putih Metalik"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">ID Pemilik (Customer)</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari ID atau Nama Pelanggan..."
              className="w-full rounded-lg border border-stroke bg-transparent pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
