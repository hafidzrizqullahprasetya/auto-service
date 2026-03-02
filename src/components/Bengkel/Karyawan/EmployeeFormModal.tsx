import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/components/Bengkel/shared";

interface EmployeeFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  mode?: "create" | "edit";
}

export function EmployeeFormModal({ onClose, onSave, initialData, mode = "create" }: EmployeeFormModalProps) {
  const isEdit = mode === "edit";

  return (
    <BaseModal
      title={isEdit ? "Edit Profil Karyawan" : "Tambah Karyawan Baru"}
      description={isEdit ? `Ubah informasi untuk staf ${initialData?.name}` : "Daftarkan mekanik atau staf administrasi baru"}
      icon={<Icons.Karyawan size={20} />}
      onClose={onClose}
      maxWidth="lg"
      hideFooter
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Contoh: Budi Sudarsono"
            defaultValue={initialData?.name}
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-black text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">Jabatan / Role</label>
            <select 
              defaultValue={initialData?.role}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            >
              <option value="Mekanik Senior">Mekanik Senior</option>
              <option value="Mekanik Junior">Mekanik Junior</option>
              <option value="Front Desk">Front Desk / Kasir</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">Status Kerja</label>
            <select 
              defaultValue={initialData?.status || "Aktif"}
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            >
              <option value="Aktif">Aktif Working</option>
              <option value="Cuti">Cuti</option>
              <option value="Off">Off / Libur</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">Nomor WhatsApp / HP</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-dark-5">+62</span>
            <input 
              type="text" 
              placeholder="8123456789"
              defaultValue={initialData?.phone}
              className="w-full rounded-lg border border-stroke bg-transparent pl-14 pr-4 py-2.5 text-lg font-black tracking-widest text-secondary outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-dark dark:text-white uppercase tracking-wider text-[11px]">Alamat (Opsional)</label>
          <textarea 
            placeholder="Alamat lengkap tempat tinggal"
            defaultValue={initialData?.address}
            rows={3}
            className="w-full resize-none rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-bold text-dark dark:text-white outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-stroke dark:border-dark-3 mt-4">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label={isEdit ? "Simpan Perubahan" : "Simpan Karyawan"} onClick={() => onSave({})} />
        </div>
      </div>
    </BaseModal>
  );
}
