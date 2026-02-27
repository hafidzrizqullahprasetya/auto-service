import { BaseModal } from "@/components/Bengkel/shared";
import { Icons } from "@/components/icons";
import { ActionButton } from "@/components/Bengkel/shared";

interface InventoryFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

export function InventoryFormModal({ onClose, onSave }: InventoryFormModalProps) {
  return (
    <BaseModal
      title="Tambah Item Inventori"
      description="Masukkan produk baru atau jasa ke dalam database stok"
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} />
          <ActionButton variant="primary" label="Simpan Item" onClick={() => onSave({})} />
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">SKU / Kode Barang</label>
          <input 
            type="text" 
            placeholder="Contoh: OLI-YAM-001"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-mono font-bold"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-dark dark:text-white">Nama Item / Jasa</label>
          <input 
            type="text" 
            placeholder="Contoh: Oli Yamalube Sport 1L"
            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-medium"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Kategori</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="Sparepart">Sparepart</option>
              <option value="Oli">Oli</option>
              <option value="Aksesoris">Aksesoris</option>
              <option value="Service">Jasa Service</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Tipe</label>
            <select className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2">
              <option value="General">General</option>
              <option value="Fast Moving">Fast Moving</option>
              <option value="Slow Moving">Slow Moving</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Harga Jual (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-dark-5">Rp</span>
              <input 
                type="number" 
                placeholder="0"
                className="w-full rounded-lg border border-stroke bg-transparent pl-12 pr-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-black text-secondary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark dark:text-white">Stok Awal</label>
            <input 
              type="number" 
              placeholder="0"
              className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 font-bold"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
