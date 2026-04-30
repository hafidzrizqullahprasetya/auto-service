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
import { serviceBundlesService, ApiServiceBundle } from "@/services/service-bundles.service";
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
  layanan: z.string().optional(),
  layananList: z.array(z.string()).min(1, "Pilih minimal satu layanan"),
  noRangka: z.string().optional().nullable(),
  keluhan: z.string().default(""),
  complaintLog: z.string().default(""),
  estimasiBiaya: z.coerce.number().default(0),
  menginap: z.boolean().default(false),
  service_bundle_id: z.coerce.number().optional().nullable(),
  image_url_1: z.string().optional().nullable(),
  image_url_2: z.string().optional().nullable(),
  image_url_3: z.string().optional().nullable(),
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
  const [bundles, setBundles] = useState<ApiServiceBundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<ApiServiceBundle | null>(null);
  const [showBundles, setShowBundles] = useState(false);
  // Multi-select layanan
  const [selectedLayanan, setSelectedLayanan] = useState<string[]>([]);
  const vehicleRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const bundleRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<QueueFormValues>({
    resolver: zodResolver(antreanSchema) as any,
    defaultValues: {
      noPolisi: "",
      tipe: "Mobil",
      kendaraan: "",
      pelanggan: "",
      waPelanggan: "",
      noRangka: "",
      layanan: "",
      layananList: [],
      keluhan: "",
      complaintLog: "",
      estimasiBiaya: 0,
      menginap: false,
      service_bundle_id: null,
      image_url_1: "",
      image_url_2: "",
      image_url_3: "",
    }
  });

  const allFields = watch();
  const watchKendaraan = watch("kendaraan");
  const watchPelanggan = watch("pelanggan");
  const watchLayanan = watch("layanan");
  const watchMenginap = watch("menginap");

  // Load draft or initial item
  useEffect(() => {
    if (item) {
      const existingLayananList = item.layanan ? item.layanan.split(", ") : [];
      setSelectedLayanan(existingLayananList);
      reset({
        noPolisi: item.noPolisi || "",
        tipe: item.tipe || "Mobil",
        kendaraan: item.kendaraan || "",
        pelanggan: item.pelanggan || "",
        waPelanggan: item.waPelanggan || "",
        layanan: item.layanan || "",
        layananList: existingLayananList,
        keluhan: item.keluhan || "",
        complaintLog: item.complaintLog || "",
        estimasiBiaya: Number(item.estimasiBiaya || 0),
        noRangka: item.noRangka || "",
        menginap: !!item.menginap,
        service_bundle_id: item.service_bundle_id ?? null,
        image_url_1: item.image_url_1 || "",
        image_url_2: item.image_url_2 || "",
        image_url_3: item.image_url_3 || "",
      });
    } else {
      const draft = localStorage.getItem("antrean_draft");
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          if (parsed.layananList) setSelectedLayanan(parsed.layananList);
          reset(parsed);
        } catch (e) {
          console.error("Failed to parse draft", e);
        }
      }
    }
  }, [item, reset]);

  // Save draft
  useEffect(() => {
    if (!isEdit) {
      const timeout = setTimeout(() => {
        localStorage.setItem("antrean_draft", JSON.stringify(allFields));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [allFields, isEdit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vData, cData, sData, bData] = await Promise.all([
          vehicleMasterService.getAll(),
          customersService.getAllRaw(),
          serviceCatalogService.getAll(),
          serviceBundlesService.getAll(),
        ]);
        setVehicleMasters(vData);
        setCustomers(cData);
        setCatalog(sData);
        setBundles(bData);
        // Pre-load selected bundle if editing
        if (item?.service_bundle_id) {
          const found = bData.find((b) => b.id === item.service_bundle_id);
          if (found) setSelectedBundle(found);
        }
      } catch (err) {
        console.error("Failed to fetch master data:", err);
      }
    };
    fetchData();
  }, []);

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
      if (bundleRef.current && !bundleRef.current.contains(event.target as Node)) {
        setShowBundles(false);
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
    // Combine selected layanan chips into single string
    const layananStr = selectedLayanan.length > 0 ? selectedLayanan.join(", ") : data.layanan;
    const payload = {
      ...data,
      layanan: layananStr,
      customer_id: item?.customer_id,
      vehicle_id: item?.vehicle_id,
      estimasi_biaya: data.estimasiBiaya,
      complaint_log: data.complaintLog || undefined,
      service_bundle_id: data.service_bundle_id || null,
    };
    onSave(payload);
  };

  // ── LAYANAN HELPERS ────────────────────────
  const addLayananChip = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    
    if (!selectedLayanan.includes(trimmed)) {
      const next = [...selectedLayanan, trimmed];
      setSelectedLayanan(next);
      setValue("layananList", next);
      
      // Auto-update price if found in catalog
      const found = catalog.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
      if (found) {
        const currentPrice = Number(watch("estimasiBiaya") || 0);
        setValue("estimasiBiaya", currentPrice + Number(found.standard_price));
      }
    }
    setValue("layanan", "");
    setShowServices(false);
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
            onClick={() => {
                // If there's text in the layanan input but not added as chip, add it now
                const currentLayananInput = watch("layanan");
                if (currentLayananInput && currentLayananInput.trim()) {
                    const next = [...selectedLayanan, currentLayananInput.trim()];
                    setSelectedLayanan(next);
                    setValue("layananList", next);
                }
                handleSubmit(onFormSubmit, onInvalid)();
            }} 
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
                          setValue("noRangka", lastVehicle.frame_number || "");
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
            <div className="flex gap-2">
              {["Mobil", "Motor"].map((type) => (
                <button
                  key={type}
                  type="button"
                  disabled={isEdit}
                  onClick={() => setValue("tipe", type as any)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-black transition-all ${
                    watch("tipe") === type
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-stroke bg-white text-dark-5 hover:border-dark-4 dark:border-dark-3 dark:bg-dark-2"
                  } ${isEdit ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {type === "Mobil" ? <Icons.KendaraanMobil size={18} /> : <Icons.KendaraanMotor size={18} />}
                  {type}
                </button>
              ))}
            </div>
            {errors.tipe && <p className="text-xs text-red-500 mt-1">{errors.tipe.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="relative" ref={vehicleRef}>
            <InputGroup
              label="Merk / Model Kendaraan"
              required
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
                      className="m-2 flex items-center justify-center gap-2 rounded-lg bg-primary/5 px-4 py-2.5 text-xs font-black text-primary transition-all hover:bg-primary/10 active:scale-95"
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
                          <Icons.Plus size={14} />
                          Tambahkan "{watchKendaraan}" ke Master Data
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <InputGroup
            label="No. Rangka (VIN)"
            placeholder="Nomor rangka kendaraan"
            {...register("noRangka")}
            disabled={isEdit}
            leftIcon={<Icons.Barcode size={18} />}
          />
        </div>


        <div className="relative" ref={serviceRef}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
              Jenis Layanan <span className="text-danger">*</span>
              <span className="ml-1 text-xs font-normal text-dark-5">(bisa pilih lebih dari satu)</span>
            </label>
            {/* Chips of selected layanan */}
            {selectedLayanan.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {selectedLayanan.map((l) => (
                  <span key={l} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    {l}
                    <button
                      type="button"
                      onClick={() => {
                        const next = selectedLayanan.filter((x) => x !== l);
                        setSelectedLayanan(next);
                        setValue("layananList", next);
                        
                        // Deduct price if found in catalog
                        const found = catalog.find(c => c.name.toLowerCase() === l.toLowerCase());
                        if (found) {
                            const currentPrice = Number(watch("estimasiBiaya") || 0);
                            setValue("estimasiBiaya", Math.max(0, currentPrice - Number(found.standard_price)));
                        }
                      }}
                      className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40"
                    >
                      <Icons.Plus size={10} className="rotate-45" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {/* Input field */}
            <InputGroup
              placeholder="Ketik lalu Tekan ENTER untuk menambah..."
              {...register("layanan")}
              error={errors.layananList?.message}
              onKeyDown={(e: any) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLayananChip(e.target.value);
                }
              }}
              onChange={(e: any) => {
                setValue("layanan", e.target.value);
                setShowServices(true);
              }}
              onFocus={() => setShowServices(true)}
              leftIcon={<Icons.History size={18} />}
              rightIcon={watchLayanan ? (
                <button 
                  type="button"
                  onClick={() => addLayananChip(watchLayanan)}
                  className="flex items-center justify-center rounded-full bg-primary p-1 text-white hover:bg-primary/80"
                  title="Tambah Layanan"
                >
                  <Icons.Plus size={16} />
                </button>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded border border-stroke text-[10px] font-bold text-dark-5">
                    ⏎
                </div>
              )}
            />
            {showServices && filteredCatalog.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-dark-2">
                <div className="flex flex-col">
                  {filteredCatalog.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-gray-1 dark:hover:bg-dark-3 ${
                        selectedLayanan.includes(s.name) ? "bg-primary/5" : ""
                      }`}
                      onClick={() => addLayananChip(s.name)}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-dark dark:text-white">{s.name}</span>
                        <span className="text-xs text-dark-5">{s.kategori}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedLayanan.includes(s.name) && (
                          <Icons.Check size={14} className="text-primary" />
                        )}
                        <span className="text-sm font-bold text-primary">Rp {Number(s.standard_price).toLocaleString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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

        {/* Complaint Log */}
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
            Log Keluhan Detail
            <span className="ml-2 text-xs font-normal text-dark-5">(opsional — catatan teknis mekanik)</span>
          </label>
          <textarea 
            rows={2}
            placeholder="Catatan detail dari pemeriksaan teknis..."
            {...register("complaintLog")}
            className="w-full rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm outline-none transition-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
          />
        </div>

        {/* Paket Service (Service Bundle) */}
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
            Paket Service
            <span className="ml-2 text-xs font-normal text-dark-5">(opsional — checklist otomatis)</span>
          </label>
          {selectedBundle ? (
            <div className="group relative flex items-center justify-between rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-3 transition-all hover:border-primary/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icons.Inventory size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-dark dark:text-white">{selectedBundle.name}</p>
                  <p className="text-xs font-bold text-primary">
                    Rp {Number(selectedBundle.price).toLocaleString("id-ID")} · {selectedBundle.items.length} checklist
                  </p>
                  {/* Task List Preview */}
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                    {selectedBundle.items.slice(0, 6).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] font-medium text-dark-5">
                        <div className="h-1 w-1 rounded-full bg-primary/40" />
                        <span className="truncate">{item.task_name}</span>
                      </div>
                    ))}
                    {selectedBundle.items.length > 6 && (
                      <div className="text-[10px] font-bold text-primary">
                        + {selectedBundle.items.length - 6} lainnya...
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedBundle(null);
                  setValue("service_bundle_id", null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-dark-5 shadow-sm transition-all hover:bg-red-50 hover:text-red-500 dark:bg-dark-3"
              >
                <Icons.Plus size={18} className="rotate-45" />
              </button>
            </div>
          ) : (
            <div className="relative" ref={bundleRef}>
              <button
                type="button"
                onClick={() => setShowBundles(!showBundles)}
                className="flex w-full items-center justify-between rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm font-bold text-dark-5 outline-none transition-all focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:focus:border-white"
              >
                <span className="flex items-center gap-2">
                   <Icons.Inventory size={18} className="text-dark-5" />
                   — Pilih Paket Service —
                </span>
                <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${showBundles ? "rotate-180" : ""}`} />
              </button>
              
              {showBundles && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-60 overflow-y-auto rounded-xl border border-stroke bg-white p-2 shadow-2 dark:border-dark-3 dark:bg-dark-2">
                  <div className="flex flex-col gap-1">
                    {bundles.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-dark-5 italic">
                        Belum ada paket tersedia
                      </div>
                    ) : (
                      bundles.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-1 dark:hover:bg-dark-3"
                          onClick={() => {
                            setSelectedBundle(b);
                            setValue("service_bundle_id", b.id);
                            setShowBundles(false);
                            if (b.price) setValue("estimasiBiaya", Number(b.price));
                            
                            // Auto-add bundle name to layanan if not exists
                            const currentLayanan = watchLayanan || "";
                            if (!currentLayanan.includes(b.name)) {
                              const newList = currentLayanan 
                                ? `${currentLayanan}, ${b.name}`
                                : b.name;
                              setValue("layanan", newList);
                              setSelectedLayanan(newList.split(", ").filter(Boolean));
                            }
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-dark dark:text-white">{b.name}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-dark-5">
                              {b.items.length} Checklist Pekerjaan
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-black text-primary">
                              Rp {Number(b.price).toLocaleString("id-ID")}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Foto Unit (3 Images) */}
        <div className="space-y-2.5">
          <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">
            Foto Unit / Kendaraan
            <span className="ml-2 text-xs font-normal text-dark-5">(opsional — link foto Google Drive/S3)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map((num) => (
              <InputGroup
                key={num}
                placeholder={`Link Foto ${num}`}
                {...register(`image_url_${num}` as any)}
                leftIcon={<Icons.Eye size={16} />}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputGroup
            label="Estimasi Biaya"
            type="number"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
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
