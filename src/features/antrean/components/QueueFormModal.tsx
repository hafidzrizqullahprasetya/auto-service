import { useState, useEffect, useRef } from "react";
import { BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { ActionButton } from "@/features/shared";
import InputGroup from "@/components/ui/InputGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { Notify } from "@/utils/notify";
import { formatWhatsApp } from "@/utils/format-phone";
import { vehicleMasterService, VehicleMaster } from "@/services/vehicle-master.service";
import { customersService } from "@/services/customers.service";
import { serviceCatalogService, ServiceCatalog } from "@/services/service-catalog.service";
import { ApiCustomer } from "@/types/api";
import { formatPlateNumber } from "@/utils/format-plate";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const antreanSchema = z.object({
  noPolisi: z.string().min(1, "No. Polisi wajib diisi"),
  tipe: z.enum(["Mobil", "Motor"]),
  kendaraan: z.string().min(1, "Merk/Model wajib diisi"),
  pelanggan: z.string().min(1, "Nama pelanggan wajib diisi"),
  waPelanggan: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  layanan: z.string().min(1, "Jenis layanan wajib diisi"),
  keluhan: z.string().default(""),
  estimasiBiaya: z.coerce.number().default(0),
  menginap: z.boolean().default(false),
});

type QueueFormValues = z.infer<typeof antreanSchema>;

interface QueueFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  item?: any;
  isLoading?: boolean;
}

export function QueueFormModal({ onClose, onSave, item, isLoading = false }: QueueFormModalProps) {
  const isEdit = !!item;
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QueueFormValues>({
    resolver: zodResolver(antreanSchema) as any,
    defaultValues: {
      noPolisi: "",
      tipe: "Mobil",
      kendaraan: "",
      pelanggan: "",
      waPelanggan: "",
      layanan: "",
      keluhan: "",
      estimasiBiaya: 0,
      menginap: false
    }
  });

  const watchKendaraan = watch("kendaraan");
  const watchPelanggan = watch("pelanggan");
  const watchLayanan = watch("layanan");
  const watchMenginap = watch("menginap");

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
      setValue("noPolisi", item.noPolisi || "");
      setValue("tipe", item.tipe || "Mobil");
      setValue("kendaraan", item.kendaraan || "");
      setValue("pelanggan", item.pelanggan || "");
      setValue("waPelanggan", item.waPelanggan || "");
      setValue("layanan", item.layanan || "");
      setValue("keluhan", item.keluhan || "");
      setValue("estimasiBiaya", Number(item.estimasiBiaya || 0));
      setValue("menginap", !!item.menginap);
    }
  }, [item, setValue]);

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
    .filter(v => v.toLowerCase().includes((watchKendaraan || "").toLowerCase()))
    .slice(0, 5);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes((watchPelanggan || "").toLowerCase()) ||
    c.phone.includes(watchPelanggan || "")
  ).slice(0, 5);

  const filteredCatalog = catalog.filter(s => 
    s.name.toLowerCase().includes((watchLayanan || "").toLowerCase())
  ).slice(0, 5);

  const isExactMatch = vehicleMasters.some(
    (v: VehicleMaster) => `${v.brand} ${v.model}`.toLowerCase() === (watchKendaraan || "").trim().toLowerCase()
  );


const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<QueueFormValues> = (data) => {
    const payload = {
      ...data,
      customer_id: item?.customer_id,
      vehicle_id: item?.vehicle_id,
      estimasi_biaya: data.estimasiBiaya,
    };
    onSave(payload);
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Antrean Kendaraan" : "Entry Antrean Baru"}
      description={isEdit ? `Perbarui detail layanan untuk unit ${item.noPolisi}` : "Tambahkan kendaraan ke antrean servis hari ini"}
      icon={<Icons.Repair size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} disabled={isLoading} />
          <ActionButton 
            variant="primary" 
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Antrean"} 
            onClick={handleSubmit(onFormSubmit, onInvalid) as any} 
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
              {...register("pelanggan")}
              disabled={isEdit}
              error={errors.pelanggan?.message}
              onChange={(e: any) => {
                setValue("pelanggan", e.target.value);
                setShowCustomers(true);
              }}
              onFocus={() => setShowCustomers(true)}
              required
              leftIcon={<Icons.Pelanggan size={18} />}
              rightIcon={watchPelanggan && !isEdit && (
                <button 
                  type="button"
                  onClick={() => {
                    setValue("pelanggan", "");
                    setValue("waPelanggan", "");
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
                        setValue("pelanggan", c.name);
                        setValue("waPelanggan", c.phone);
                        if (lastVehicle) {
                          setValue("noPolisi", lastVehicle.plate_number);
                          setValue("tipe", (lastVehicle.type === "Motor" ? "Motor" : "Mobil") as any);
                          setValue("kendaraan", `${lastVehicle.brand} ${lastVehicle.model}`);
                          Notify.toast(`Data ${c.name} & Unit ${lastVehicle.plate_number} dimuat`, "success", "top");
                        } else {
                          Notify.toast(`Data ${c.name} dimuat`, "success", "top");
                        }
                        setShowCustomers(false);
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
            placeholder="Contoh: 08123456789"
            type="tel"
            {...register("waPelanggan")}
            leftIcon={<Icons.Whatsapp size={18} className="text-secondary" />}
            onChange={(e: any) => {
              const formatted = formatWhatsApp(e.target.value);
              setValue("waPelanggan", formatted);
            }}
            error={errors.waPelanggan?.message}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="No. Polisi"
            placeholder="Contoh: B 1234 ABC"
            {...register("noPolisi")}
            disabled={isEdit}
            error={errors.noPolisi?.message}
            onChange={(e: any) => setValue("noPolisi", formatPlateNumber(e.target.value))}
            className="uppercase font-bold tracking-widest"
            required
            leftIcon={<Icons.Tag size={18} />}
          />
          
          <div className="space-y-2.5">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Jenis Unit</label>
            <div className="relative">
              <select 
                {...register("tipe")}
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
            {errors.tipe && <p className="text-xs text-red-500 mt-1">{errors.tipe.message}</p>}
          </div>
        </div>

        <div className="relative" ref={vehicleRef}>
          <InputGroup
            label="Merk / Model Kendaraan"
            placeholder="Contoh: Toyota Avanza"
            {...register("kendaraan")}
            disabled={isEdit}
            error={errors.kendaraan?.message}
            onChange={(e: any) => {
              setValue("kendaraan", e.target.value);
              setShowVehicles(true);
            }}
            onFocus={() => setShowVehicles(true)}
            rightIcon={watchKendaraan && !isEdit && (
              <button 
                type="button"
                onClick={() => {
                  setValue("kendaraan", "");
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
                      setValue("kendaraan", v);
                      setShowVehicles(false);
                    }}
                  >
                    {v}
                  </button>
                ))}
                
                {watchKendaraan && watchKendaraan.trim() !== "" && !isExactMatch && (
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 border-t border-stroke px-5 py-3 text-sm font-bold text-primary hover:bg-primary/5 dark:border-dark-3"
                    onClick={async () => {
                      const input = watchKendaraan.trim();
                      const parts = input.split(" ");
                      const brand = parts[0];
                      const model = parts.slice(1).join(" ") || "Generic";
                      
                      setAddingVehicleMaster(true);
                      try {
                        const newMaster = await vehicleMasterService.create(brand, model);
                        setVehicleMasters([...vehicleMasters, newMaster]);
                        setValue("kendaraan", `${newMaster.brand} ${newMaster.model}`);
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
                        Tambah "{watchKendaraan}" ke Master
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
            {...register("layanan")}
            error={errors.layanan?.message}
            onChange={(e: any) => {
              setValue("layanan", e.target.value);
              setShowServices(true);
            }}
            onFocus={() => setShowServices(true)}
            required
            leftIcon={<Icons.History size={18} />}
            rightIcon={watchLayanan && (
              <button 
                type="button"
                onClick={() => {
                  setValue("layanan", "");
                  setValue("estimasiBiaya", 0);
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
                      setValue("layanan", s.name);
                      setValue("estimasiBiaya", Number(s.standard_price));
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
            {...register("keluhan")}
            className="w-full rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm outline-none transition-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Estimasi Biaya"
            type="number"
            placeholder="Rp."
            {...register("estimasiBiaya")}
            error={errors.estimasiBiaya?.message}
            leftIcon={<span className="text-xs font-bold text-dark-5">Rp</span>}
          />
          <div className="flex flex-col flex-1 justify-center pt-6">
            <Checkbox
              label="Kendaraan Menginap"
              checked={watchMenginap}
              onChange={(e) => setValue("menginap", e.target.checked)}
              withIcon="check"
              withBg
              radius="md"
              disabled={isEdit && item?.status === "Selesai"}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}

export { QueueFormModal as AntreanFormModal };
