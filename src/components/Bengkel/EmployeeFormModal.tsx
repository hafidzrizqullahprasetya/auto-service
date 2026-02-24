import { BaseModal } from "./BaseModal";
import { Icons } from "@/components/Icons";
import { ActionButton } from "./ActionButton";

interface EmployeeFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function EmployeeFormModal({ onClose, onSave }: EmployeeFormModalProps) {
  return (
    <BaseModal
      title="Tambah Karyawan Baru"
      description="Daftarkan mekanik atau staf administrasi baru"
      icon={<Icons.Karyawan size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label="Simpan Karyawan" onClick={() => onSave({})} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Contoh: Budi Sudarsono"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-bold"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Jabatan / Role</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="Mekanik Senior">Mekanik Senior</option>
              <option value="Mekanik Junior">Mekanik Junior</option>
              <option value="Front Desk">Front Desk / Kasir</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Status</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="Aktif">Aktif Working</option>
              <option value="Cuti">Cuti</option>
              <option value="Off">Off / Libur</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nomor WhatsApp / HP</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">+62</span>
            <input 
              type="text" 
              placeholder="8123456789"
              className="w-full rounded-lg border border-stroke bg-transparent pl-14 pr-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Alamat (Opsional)</label>
          <textarea 
            placeholder="Alamat lengkap tempat tinggal"
            rows={3}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2"
          />
        </div>
      </div>
    </BaseModal>
  );
}
