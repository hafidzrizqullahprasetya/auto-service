import { useState, useEffect, useRef } from "react";
import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
import InputGroup from "@/components/ui/InputGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Notify } from "@/utils/notify";
import { vehicleMasterService, VehicleMaster } from "@/services/vehicle-master.service";
import { customersService } from "@/services/customers.service";
import { serviceCatalogService, ServiceCatalog } from "@/services/service-catalog.service";
import { ApiCustomer, ApiVehicle } from "@/types/api";

interface AntreanFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  item?: any;
  isLoading?: boolean;
}

export function AntreanFormModal({ onClose, onSave, item, isLoading = false }: AntreanFormModalProps) {
  const isEdit = !!item;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVehicles, setShowVehicles] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [addingVehicleMaster, setAddingVehicleMaster] = useState(false);
  const [vehicleMasters, setVehicleMasters] = useState<VehicleMaster[]>([]);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [catalog, setCatalog] = useState<ServiceCatalog[]>([]);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    noPolisi: "",
    tipe: "Mobil",
    kendaraan: "",
    pelanggan: "",
    waPelanggan: "",
    layanan: "",
    keluhan: "",
    estimasiBiaya: 0,
    menginap: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, cData, sData] = await Promise.all([
          vehicleMasterService.getAll(),
          customersService.getAllRaw(),
          serviceCatalogService.getAll()
        ]);
        setVehicleMasters(vData);
        setCustomers(cData);
        setCatalog(sData);
      } catch (err) {
        console.error("Failed to fetch master data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        noPolisi: item.noPolisi || "",
        tipe: item.tipe || "Mobil",
        kendaraan: item.kendaraan || "",
        pelanggan: item.pelanggan || "",
        waPelanggan: item.waPelanggan || "",
        layanan: item.layanan || "",
        keluhan: item.keluhan || "",
        estimasiBiaya: Number(item.estimasiBiaya || 0),
        menginap: !!item.menginap
      });
    }
  }, [item]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (vehicleRef.current && !vehicleRef.current.contains(event.target as Node)) {
        setShowVehicles(false);
      }
      if (customerRef.current && !customerRef.current.contains(event.target as Node)) {
        setShowCustomers(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setShowServices(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredVehicles = vehicleMasters
    .map(v => `${v.brand} ${v.model}`)
    .filter(v => v.toLowerCase().includes(formData.kendaraan.toLowerCase()))
    .slice(0, 5);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(formData.pelanggan.toLowerCase()) ||
    c.phone.includes(formData.pelanggan)
  ).slice(0, 5);

  const filteredCatalog = catalog.filter(s => 
    s.name.toLowerCase().includes(formData.layanan.toLowerCase())
  ).slice(0, 5);

  const isExactMatch = vehicleMasters.some(
    (v: VehicleMaster) => `${v.brand} ${v.model}`.toLowerCase() === formData.kendaraan.trim().toLowerCase()
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.noPolisi) newErrors.noPolisi = "No. Polisi wajib diisi";
    if (!formData.kendaraan) newErrors.kendaraan = "Merk/Model wajib diisi";
    if (!formData.pelanggan) newErrors.pelanggan = "Nama pelanggan wajib diisi";
    if (!formData.layanan) newErrors.layanan = "Jenis layanan wajib diisi";
    if (!formData.waPelanggan) newErrors.waPelanggan = "Nomor WhatsApp wajib diisi";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPlateNumber = (val: string) => {
    const clean = val.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 9)
    const prefixMatch = clean.match(/^[A-Z]{1,2}/);
    if (!prefixMatch) return clean;
    const prefix = prefixMatch[0];
    const afterPrefix = clean.slice(prefix.length);
    const numberMatch = afterPrefix.match(/^[0-9]{1,4}/);
    if (!numberMatch) {
      return afterPrefix ? `${prefix} ${afterPrefix}` : prefix;
    }
    const number = numberMatch[0];
    const suffix = afterPrefix.slice(number.length).replace(/[^A-Z]/g, ""); 
    return `${prefix} ${number}${suffix ? " " + suffix : ""}`.trim();
  };

  const handleSubmit = () => {
    if (!validate()) {
      Notify.alert("Validasi Gagal", "Mohon lengkapi semua kolom yang wajib diisi.");
      return;
    }

    const payload = {
      ...formData,
      // Pass IDs only if editing or specifically resolved
      customer_id: item?.customer_id,
      vehicle_id: item?.vehicle_id,
      estimasi_biaya: formData.estimasiBiaya,
    };
    onSave(payload);
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Antrean Kendaraan" : "Entry Antrean Baru"}
      description={isEdit ? `Perbarui detail layanan untuk unit ${item.noPolisi}` : "Tambahkan kendaraan ke antrean servis hari ini"}
      icon={<Icons.Kasir size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} disabled={isLoading} />
          <ActionButton 
            variant="primary" 
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Antrean"} 
            onClick={handleSubmit} 
            disabled={isLoading} 
          />
        </div>
      }
    >
      <div className="space-y-5 text-left py-2">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="relative" ref={customerRef}>
            <InputGroup
              label="Nama Pelanggan"
              placeholder="Nama lengkap pemilik"
              value={formData.pelanggan}
              disabled={isEdit}
              error={errors.pelanggan}
              onChange={(e: any) => {
                setFormData({ ...formData, pelanggan: e.target.value });
                setShowCustomers(true);
              }}
              onFocus={() => setShowCustomers(true)}
              required
              leftIcon={<Icons.Pelanggan size={18} />}
              rightIcon={formData.pelanggan && !isEdit && (
                <button 
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, pelanggan: "", waPelanggan: "" });
                    setShowCustomers(false);
                  }}
                  className="flex items-center justify-center rounded-full p-1 hover:bg-gray-2 dark:hover:bg-dark-3"
                >
                  <Icons.Plus size={16} className="rotate-45 text-dark-5" />
                </button>
              )}
            />
            {showCustomers && !isEdit && filteredCustomers.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-dark-2">
                <div className="flex flex-col">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="flex w-full flex-col px-5 py-3 text-left hover:bg-gray-1 dark:hover:bg-dark-3"
                      onClick={async () => {
                        const lastVehicle = c.vehicles && c.vehicles.length > 0 ? c.vehicles[0] : null;
                        setFormData({
                          ...formData,
                          pelanggan: c.name,
                          waPelanggan: c.phone,
                          noPolisi: lastVehicle ? lastVehicle.plate_number : formData.noPolisi,
                          tipe: lastVehicle ? lastVehicle.type : formData.tipe,
                          kendaraan: lastVehicle ? `${lastVehicle.brand} ${lastVehicle.model}` : formData.kendaraan,
                        });
                        setShowCustomers(false);
                        if (lastVehicle) {
                          Notify.toast(`Data ${c.name} & Unit ${lastVehicle.plate_number} dimuat`, "success", "top");
                        } else {
                          Notify.toast(`Data ${c.name} dimuat`, "success", "top");
                        }
                      }}
                    >
                      <span className="text-sm font-bold text-dark dark:text-white">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-dark-5">{c.phone}</span>
                        {c.vehicles && c.vehicles.length > 0 && (
                          <span className="text-[10px] bg-gray-2 dark:bg-dark-3 px-1.5 py-0.5 rounded text-dark-5 font-bold">
                            {c.vehicles[0].plate_number}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <InputGroup
            label="Nomor WhatsApp"
            placeholder="081xxx (Untuk notif)"
            value={formData.waPelanggan}
            disabled={isEdit}
            error={errors.waPelanggan}
            onChange={(e: any) => setFormData({ ...formData, waPelanggan: e.target.value })}
            required
            leftIcon={<Icons.Whatsapp size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="No. Polisi"
            placeholder="Contoh: B 1234 ABC"
            value={formData.noPolisi}
            disabled={isEdit}
            error={errors.noPolisi}
            onChange={(e: any) => setFormData({ ...formData, noPolisi: formatPlateNumber(e.target.value) })}
            className="uppercase font-bold tracking-widest"
            required
            leftIcon={<Icons.Tag size={18} />}
          />
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Jenis Unit</label>
            <div className="relative">
              <select 
                value={formData.tipe}
                onChange={(e) => setFormData({ ...formData, tipe: e.target.value })}
                className="w-full appearance-none rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm font-bold outline-none transition-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
                disabled={isEdit}
              >
                <option value="Mobil">Mobil</option>
                <option value="Motor">Motor</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-dark-5 dark:text-dark-6">
                <Icons.ChevronDown size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative" ref={vehicleRef}>
          <InputGroup
            label="Merk / Model Kendaraan"
            placeholder="Contoh: Toyota Avanza"
            value={formData.kendaraan}
            disabled={isEdit}
            error={errors.kendaraan}
            onChange={(e: any) => {
              setFormData({ ...formData, kendaraan: e.target.value });
              setShowVehicles(true);
            }}
            onFocus={() => setShowVehicles(true)}
            rightIcon={formData.kendaraan && !isEdit && (
              <button 
                type="button"
                onClick={() => {
                  setFormData({ ...formData, kendaraan: "" });
                  setShowVehicles(false);
                }}
                className="flex items-center justify-center rounded-full p-1 hover:bg-gray-2 dark:hover:bg-dark-3"
              >
                <Icons.Plus size={16} className="rotate-45 text-dark-5" />
              </button>
            )}
            leftIcon={<Icons.Repair size={18} />}
          />
          {showVehicles && !isEdit && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex flex-col">
                {filteredVehicles.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    className="flex w-full items-center px-5 py-3 text-sm font-semibold text-dark hover:bg-gray-1 dark:text-white dark:hover:bg-dark-3"
                    onClick={() => {
                      setFormData({ ...formData, kendaraan: v });
                      setShowVehicles(false);
                    }}
                  >
                    {v}
                  </button>
                ))}
                
                {formData.kendaraan.trim() !== "" && !isExactMatch && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 border-t border-stroke px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5 dark:border-dark-3"
                    onClick={async () => {
                      const input = formData.kendaraan.trim();
                      const parts = input.split(" ");
                      const brand = parts[0];
                      const model = parts.slice(1).join(" ") || "Generic";
                      
                      setAddingVehicleMaster(true);
                      try {
                        const newMaster = await vehicleMasterService.create(brand, model);
                        setVehicleMasters([...vehicleMasters, newMaster]);
                        setFormData({ ...formData, kendaraan: `${newMaster.brand} ${newMaster.model}` });
                        setShowVehicles(false);
                        Notify.toast("Merk/Model ditambahkan ke data master", "success", "top");
                      } catch (err) {
                        Notify.alert("Gagal", "Gagal menambahkan data master");
                      } finally {
                        setAddingVehicleMaster(false);
                      }
                    }}
                    disabled={addingVehicleMaster}
                  >
                    {addingVehicleMaster ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                        Menambahkan...
                      </>
                    ) : (
                      <>
                        <Icons.Plus size={16} />
                        Tambah "{formData.kendaraan}" ke Master
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>


        <div className="relative" ref={serviceRef}>
          <InputGroup
            label="Jenis Layanan"
            placeholder="Contoh: Ganti Oli & Filter"
            value={formData.layanan}
            error={errors.layanan}
            onChange={(e: any) => {
              setFormData({ ...formData, layanan: e.target.value });
              setShowServices(true);
            }}
            onFocus={() => setShowServices(true)}
            required
            leftIcon={<Icons.Kasir size={18} />}
            rightIcon={formData.layanan && (
              <button 
                type="button"
                onClick={() => {
                  setFormData({ ...formData, layanan: "", estimasiBiaya: 0 });
                  setShowServices(false);
                }}
                className="flex items-center justify-center rounded-full p-1 hover:bg-gray-2 dark:hover:bg-dark-3"
              >
                <Icons.Plus size={16} className="rotate-45 text-dark-5" />
              </button>
            )}
          />
          {showServices && filteredCatalog.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex flex-col">
                {filteredCatalog.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="flex w-full items-center justify-between px-5 py-3 text-left hover:bg-gray-1 dark:hover:bg-dark-3"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        layanan: s.name,
                        estimasiBiaya: Number(s.standard_price)
                      });
                      setShowServices(false);
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-dark dark:text-white">{s.name}</span>
                      <span className="text-xs text-dark-5">{s.kategori}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">Rp {Number(s.standard_price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Keluhan / Catatan</label>
          <textarea 
            rows={3}
            placeholder="Deskripsi keluhan pelanggan..."
            value={formData.keluhan}
            onChange={(e) => setFormData({ ...formData, keluhan: e.target.value })}
            className="w-full rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm outline-none transition-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Estimasi Biaya"
            type="number"
            placeholder="Rp."
            value={String(formData.estimasiBiaya)}
            onChange={(e: any) => setFormData({ ...formData, estimasiBiaya: Number(e.target.value) })}
            leftIcon={<span className="text-xs font-bold text-dark-5">Rp</span>}
          />
          <div className="flex flex-col flex-1 justify-center pt-6">
            <Checkbox
              label="Kendaraan Menginap"
              checked={formData.menginap}
              onChange={(e) => setFormData({ ...formData, menginap: e.target.checked })}
              withIcon="check"
              withBg
              radius="md"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

