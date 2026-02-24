import { BaseModal } from "./BaseModal";
import { Icons } from "@/components/Icons";
import { ActionButton } from "./ActionButton";

interface CustomerFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function CustomerFormModal({ onClose, onSave }: CustomerFormModalProps) {
  return (
    <BaseModal
      title="Tambah Pelanggan Baru"
      description="Simpan data profil pelanggan untuk program loyalitas"
      icon={<Icons.Pelanggan size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label="Simpan Pelanggan" onClick={() => onSave({})} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nama Lengkap Pelanggan</label>
          <input 
            type="text" 
            placeholder="Contoh: Ani Wijaya"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nomor WhatsApp / HP</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">+62</span>
            <input 
              type="text" 
              placeholder="8123456789"
              className="w-full rounded-lg border border-stroke bg-transparent pl-14 pr-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-extrabold text-lg tracking-widest"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Email (Opsional)</label>
          <input 
            type="email" 
            placeholder="contoh@email.com"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Alamat Lengkap</label>
          <textarea 
            placeholder="Alamat penagihan atau tempat tinggal"
            rows={3}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
