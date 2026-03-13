"use client";
import { useState, useEffect, useRef } from "react";
import { BaseModal, ActionButton } from "@/features/shared";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";
import { Notify } from "@/utils/notify";
import { customersService } from "@/services/customers.service";
import { ApiCustomer } from "@/types/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";

const reminderSchema = z.object({
  customerName: z.string().min(1, "Nama pelanggan wajib diisi"),
  plateNumber: z.string().min(1, "No. Polisi wajib diisi"),
  jenisReminder: z.string().min(1, "Jenis reminder wajib diisi"),
  jadwalTanggal: z.string().min(1, "Tanggal wajib diisi"),
  odometerSaat: z.coerce.number().optional(),
  odometerTarget: z.coerce.number().optional(),
  catatan: z.string().optional(),
  status: z.string().default("aktif"),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

interface ReminderFormModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  item?: any;
  isLoading?: boolean;
}

export function ReminderFormModal({ onClose, onSave, item, isLoading = false }: ReminderFormModalProps) {
  const isEdit = !!item;
  const [showCustomers, setShowCustomers] = useState(false);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<ApiCustomer | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  
  const customerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema) as any,
    defaultValues: {
      customerName: "",
      plateNumber: "",
      jenisReminder: "Ganti Oli",
      jadwalTanggal: dayjs().add(3, "month").format("YYYY-MM-DD"),
      odometerSaat: 0,
      odometerTarget: 0,
      catatan: "",
      status: "aktif",
    }
  });

  const watchCustomerName = watch("customerName");

  useEffect(() => {
    if (item) {
      reset({
        customerName: item.pelanggan || "",
        plateNumber: item.noPolisi || "",
        jenisReminder: item.jenisReminder || "Ganti Oli",
        jadwalTanggal: dayjs(item.jadwalTanggal).format("YYYY-MM-DD"),
        odometerSaat: Number(item.odometerSaat || 0),
        odometerTarget: Number(item.odometerTarget || 0),
        catatan: item.catatan || "",
        status: item.status?.toLowerCase() || "aktif",
      });
      setSelectedVehicleId(item.vehicle_id);
    }
  }, [item, reset]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const cData = await customersService.getAllRaw();
        setCustomers(cData);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerRef.current && !customerRef.current.contains(event.target as Node)) {
        setShowCustomers(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes((watchCustomerName || "").toLowerCase()) ||
    c.phone.includes(watchCustomerName || "")
  ).slice(0, 5);

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  const onFormSubmit: SubmitHandler<ReminderFormValues> = (data) => {
    if (!isEdit && (!selectedCustomer || !selectedVehicleId)) {
      Notify.alert("Peringatan", "Silakan pilih pelanggan dan kendaraan dari daftar yang tersedia", "warning");
      return;
    }

    const payload = {
      customer_id: isEdit ? item.customer_id : selectedCustomer?.id,
      vehicle_id: isEdit ? item.vehicle_id : selectedVehicleId,
      jenis_reminder: data.jenisReminder,
      jadwal_tanggal: data.jadwalTanggal,
      odometer_saat: data.odometerSaat,
      odometer_target: data.odometerTarget,
      catatan: data.catatan,
      status: data.status,
    };
    onSave(payload);
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Reminder" : "Tambah Reminder Baru"}
      description={isEdit ? `Perbarui detail reminder untuk ${item.noPolisi}` : "Buat pengingat servis otomatis untuk pelanggan"}
      icon={<Icons.Notification size={20} />}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <ActionButton variant="ghost" label="Batal" onClick={onClose} disabled={isLoading} />
          <ActionButton 
            variant="primary" 
            label={isLoading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Reminder"} 
            onClick={handleSubmit(onFormSubmit, onInvalid) as any} 
            disabled={isLoading} 
          />
        </div>
      }
    >
      <div className="space-y-4 text-left py-2">
        <div className="relative" ref={customerRef}>
          <InputGroup
            label="Pelanggan & Kendaraan"
            placeholder="Cari pelanggan..."
            {...register("customerName")}
            disabled={isEdit}
            error={errors.customerName?.message}
            onChange={(e: any) => {
              setValue("customerName", e.target.value);
              setShowCustomers(true);
            }}
            onFocus={() => setShowCustomers(true)}
            required
            leftIcon={<Icons.Pelanggan size={18} />}
          />
          {showCustomers && !isEdit && filteredCustomers.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-dark-2">
              <div className="flex flex-col">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="border-b border-stroke last:border-0 dark:border-dark-3">
                    <div className="bg-gray-1 px-4 py-1.5 text-[10px] font-bold text-dark-5 dark:bg-dark-3 uppercase tracking-wider">
                      {c.name} ({c.phone})
                    </div>
                    {c.vehicles && c.vehicles.length > 0 ? (
                      c.vehicles.map(v => (
                        <button
                          key={v.id}
                          type="button"
                          className="flex w-full items-center justify-between px-5 py-2.5 text-left hover:bg-primary/5 group"
                          onClick={() => {
                            setSelectedCustomer(c);
                            setSelectedVehicleId(v.id);
                            setValue("customerName", c.name);
                            setValue("plateNumber", v.plate_number);
                            setShowCustomers(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-dark dark:text-white group-hover:text-primary transition-colors">
                              {v.plate_number}
                            </span>
                            <span className="text-[11px] text-dark-5">{v.brand} {v.model}</span>
                          </div>
                          <Icons.ChevronUp className="rotate-90 text-dark-5 group-hover:text-primary transition-colors" size={14} />
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-2.5 text-xs italic text-dark-5">Tidak ada kendaraan terdaftar</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {watch("plateNumber") && (
           <div className="rounded-lg bg-gray-2 p-3 dark:bg-dark-3 border border-stroke dark:border-dark-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-white dark:bg-dark-2 flex items-center justify-center text-dark dark:text-white border border-stroke dark:border-dark-4">
                  <Icons.KendaraanMobil size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-5 uppercase leading-none mb-1">Unit Terpilih</p>
                  <p className="text-sm font-black text-dark dark:text-white leading-none">{watch("plateNumber")}</p>
                </div>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Jenis Reminder</label>
            <div className="relative">
              <select 
                {...register("jenisReminder")}
                className="w-full appearance-none rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm font-bold outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
              >
                <option value="Ganti Oli">Ganti Oli</option>
                <option value="Service Rutin">Service Rutin</option>
                <option value="Tune Up">Tune Up</option>
                <option value="Cek Rem">Cek Rem</option>
                <option value="Perpanjang STNK">Perpanjang STNK</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-dark-5">
                <Icons.ChevronDown size={14} />
              </div>
            </div>
          </div>

          <InputGroup
            label="Jadwal Tanggal"
            type="date"
            {...register("jadwalTanggal")}
            error={errors.jadwalTanggal?.message}
            required
            leftIcon={<Icons.Calendar size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputGroup
            label="Odometer Saat Ini"
            type="number"
            {...register("odometerSaat")}
            placeholder="KM saat ini"
            leftIcon={<Icons.Dashboard size={18} />}
          />
          <InputGroup
            label="Odometer Target"
            type="number"
             {...register("odometerTarget")}
            placeholder="Target KM"
            leftIcon={<Icons.Check size={18} />}
          />
        </div>

        <InputGroup
          label="Catatan"
          placeholder="Tambahkan catatan jika perlu..."
          {...register("catatan")}
          leftIcon={<Icons.Edit size={18} />}
        />

        {isEdit && (
          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark-5 dark:text-dark-6">Status</label>
            <div className="relative">
              <select 
                {...register("status")}
                className="w-full appearance-none rounded-lg border-2 border-stroke bg-white px-5 py-3 text-sm font-bold outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-white"
              >
                <option value="aktif">Aktif</option>
                <option value="terkirim">Terkirim</option>
                <option value="lewat jatuh tempo">Lewat Jatuh Tempo</option>
                <option value="batal">Batal</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-dark-5">
                <Icons.ChevronDown size={14} />
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}
