import { BaseModal } from "./BaseModal";
import { Icons } from "@/components/Icons";
import { ActionButton } from "./ActionButton";

interface AntreanFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function AntreanFormModal({ onClose, onSave }: AntreanFormModalProps) {
  return (
    <BaseModal
      title="Entry Antrean Baru"
      description="Tambahkan kendaraan ke antrean servis hari ini"
      icon={<Icons.Kasir size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label="Simpan Antrean" onClick={() => onSave({})} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">No. Polisi</label>
            <input 
              type="text" 
              placeholder="Contoh: B 1234 ABC"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 uppercase font-black tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Jenis Unit</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="Mobil">Mobil</option>
              <option value="Motor">Motor</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Merk / Model Kendaraan</label>
          <input 
            type="text" 
            placeholder="Contoh: Toyota Avanza"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nama Pelanggan</label>
          <input 
            type="text" 
            placeholder="Nama lengkap pemilik"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Jenis Layanan</label>
          <input 
            type="text" 
            placeholder="Contoh: Ganti Oli & Filter"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
