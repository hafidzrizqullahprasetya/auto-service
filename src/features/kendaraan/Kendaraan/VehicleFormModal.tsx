import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";

interface VehicleFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

export function VehicleFormModal({ onClose, onSave, initialData, mode = "create", isLoading = false }: VehicleFormModalProps) {
  const isEdit = mode === "edit";

  return (
    <BaseModal
      title={isEdit ? "Edit Data Kendaraan" : "Registrasi Kendaraan Baru"}
      description={isEdit ? `Ubah informasi teknis untuk unit ${initialData?.plateNumber}` : "Daftarkan kendaraan baru ke sistem untuk tracking service book"}
      icon={<Icons.KendaraanMobil size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} disabled={isLoading} />
          <ActionButton variant="primary" label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Daftarkan Unit"} onClick={() => onSave({})} disabled={isLoading} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">No. Polisi (Plat Nomor)</label>
          <input 
            type="text" 
            placeholder="Contoh: B 1234 ABC"
            defaultValue={initialData?.plateNumber}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 uppercase text-secondary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Jenis Unit</label>
            <select 
              defaultValue={initialData?.type || "Mobil"}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            >
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Tahun Produksi</label>
            <input 
              type="number" 
              placeholder="Contoh: 2022"
              defaultValue={initialData?.year}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Merk</label>
            <input 
              type="text" 
              placeholder="Contoh: Toyota"
              defaultValue={initialData?.brand}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white">Model / Tipe</label>
            <input 
              type="text" 
              placeholder="Contoh: Avanza"
              defaultValue={initialData?.model}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">Warna</label>
          <input 
            type="text" 
            placeholder="Contoh: Putih Metalik"
            defaultValue={initialData?.color}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white">Pilih Pemilik (Customer)</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari ID atau Nama Pelanggan..."
              defaultValue={initialData?.ownerId ? `ID: ${initialData.ownerId}` : ""}
              className="w-full rounded-lg border border-stroke bg-transparent pl-10 pr-4 py-2.5 text-sm font-medium text-dark dark:text-white outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
            />
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-5" />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
