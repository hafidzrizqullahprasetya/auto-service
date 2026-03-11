"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Badge } from "@/features/shared";
import InputGroup from "@/components/ui/InputGroup";
import { SectionCard } from "./SectionCard";
import { WAGatewayTabSkeleton } from "./WAGatewayTabSkeleton";
import { Notify } from "@/utils/notify";
import { Icons } from "@/components/Icons/index";
import { cn } from "@/lib/utils";
import { formatWhatsApp } from "@/utils/format-phone";

const waSchema = z.object({
  wa_target_number: z.string().min(10, "Nomor target minimal 10 digit"),
  wa_bot_enabled: z.boolean(),
  wa_template_stok: z.string().optional().nullable(),
  wa_template_dikerjakan: z.string().optional().nullable(),
  wa_template_selesai: z.string().optional().nullable(),
});

type WaFormValues = {
  wa_target_number: string;
  wa_bot_enabled: boolean;
  wa_template_stok?: string | null;
  wa_template_dikerjakan?: string | null;
  wa_template_selesai?: string | null;
};

interface WAGatewayTabProps {
  settings: any;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
  saving: boolean;
}

export function WAGatewayTab({
  settings,
  onSave,
  loading,
  saving,
}: WAGatewayTabProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [waStatus, setWaStatus] = useState<string>("checking...");
  const [waQr, setWaQr] = useState<string | null>(null);
  const [botInfo, setBotInfo] = useState<{name?: string; number?: string; avatar?: string} | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isRestartLoading, setIsRestartLoading] = useState(false);
  const [isClearingLogs, setIsClearingLogs] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WaFormValues>({
    resolver: zodResolver(waSchema),
    defaultValues: {
      wa_target_number: settings?.wa_target_number ?? "",
      wa_bot_enabled: settings?.wa_bot_enabled ?? true,
      wa_template_stok: settings?.wa_template_stok ?? "",
      wa_template_dikerjakan: settings?.wa_template_dikerjakan ?? "",
      wa_template_selesai: settings?.wa_template_selesai ?? "",
    },
  });

  const botEnabled = watch("wa_bot_enabled");

  useEffect(() => {
    if (settings) {
      reset({
        wa_target_number: settings.wa_target_number || "",
        wa_bot_enabled: settings.wa_bot_enabled ?? true,
        wa_template_stok: settings.wa_template_stok || "",
        wa_template_dikerjakan: settings.wa_template_dikerjakan || "",
        wa_template_selesai: settings.wa_template_selesai || "",
      });
    }
  }, [settings, reset]);

  const fetchLogs = async () => {
    try {
      const { api } = await import("@/lib/api");
      const logsRes = await api.get<any[]>("/api/v1/notifications/wa");
      setLogs(logsRes.data || []);
      setLoadingLogs(false);
    } catch (err) {}
  };

  useEffect(() => {
    async function fetchServer() {
      try {
        const { api } = await import("@/lib/api");
        await fetchLogs();
        const statusRes = await api.get<any>("/api/v1/notifications/wa/status");
        const st = statusRes.data.status;
        setWaStatus(st);
        setBotInfo(statusRes.data.bot || null);

        if (st === "qr_ready") {
          const qrRes = await api.get<any>("/api/v1/notifications/wa/qr");
          if (qrRes.data?.qr) {
            setWaQr(qrRes.data.qr);
          }
        } else {
          setWaQr(null);
        }
      } catch (err: any) {
        if (err.message && err.message.includes("WA_WORKER_NOT_RUNNING")) {
          setWaStatus("disconnected");
        }
      }
    }

    fetchServer();
    const interval = setInterval(fetchServer, 5000); 
    return () => clearInterval(interval);
  }, []);

  if (loading) return <WAGatewayTabSkeleton />;

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Cek Kembali", firstError.message, "error");
    }
  };

  const onSubmit = async (data: WaFormValues) => {
    await onSave({ 
      ...settings, 
      wa_target_number: data.wa_target_number,
      wa_bot_enabled: data.wa_bot_enabled,
      wa_template_stok: data.wa_template_stok,
      wa_template_dikerjakan: data.wa_template_dikerjakan,
      wa_template_selesai: data.wa_template_selesai,
    });
  };

  const handleClearLogs = async () => {
    const isConfirm = await Notify.confirm("Hapus Semua Log?", "Tindakan ini tidak bisa dibatalkan.");
    if (!isConfirm) return;

    setIsClearingLogs(true);
    try {
      const { api } = await import("@/lib/api");
      await api.delete("/api/v1/notifications/wa");
      setLogs([]);
      Notify.toast("Semua log berhasil dihapus");
    } catch (err: any) {
      Notify.alert("Gagal", err.message || "Gagal menghapus log", "error");
    } finally {
      setIsClearingLogs(false);
    }
  };

  const handleTestNotification = async () => {
    if (waStatus !== "ready") {
      Notify.alert(
        "Gagal",
        "Koneksi WhatsApp belum siap. Pastikan statusnya Connected.",
        "error",
      );
      return;
    }

    if (!settings?.wa_target_number) {
      Notify.alert(
        "Gagal",
        "Silakan simpan Nomor WA Penerima terlebih dahulu sebelum uji coba.",
        "warning",
      );
      return;
    }

    setIsTestLoading(true);
    Notify.loading("Mengirim pesan test...");
    try {
      const { api } = await import("@/lib/api");
      await api.post("/api/v1/notifications/wa/test");
      Notify.toast("Test notifikasi terkirim ke antrian");
      
      // Delay buatan 1.5 detik agar user merasa ada "proses" dan tidak nyepam klik
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      fetchLogs();
    } catch (err: any) {
      Notify.alert("Gagal", err.message || "Gagal mengirim testing", "error");
    } finally {
      setIsTestLoading(false);
      Notify.close();
    }
  };

  const handleRestartLogout = async () => {
    setIsRestartLoading(true);
    try {
      const { api } = await import("@/lib/api");
      await api.post("/api/v1/notifications/wa/restart");
      Notify.toast("Meminta sesi QR baru...");
      setWaStatus("initializing");
      setWaQr(null);
    } catch (err: any) {
      Notify.alert("Gagal", err.message || "Gagal merestart WhatsApp", "error");
    } finally {
      setIsRestartLoading(false);
    }
  };

  const getNotifTitle = (notif: any) => {
    if (notif.spare_parts?.name) return notif.spare_parts.name;
    const body = notif.message_body || "";
    if (body.includes("Stok Menipis")) return "Peringatan Stok";
    if (body.includes("Update Kendaraan")) return "Update Progress";
    if (body.includes("Siap Diambil")) return "Kendaraan Selesai";
    if (body.includes("Test Notifikasi")) return "Uji Coba Sistem";
    return "Notifikasi Sistem";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bagian Atas: Koneksi (Full Width) */}
      <SectionCard title="Koneksi WhatsApp Web">
        <div className="flex flex-col gap-8 py-2 md:flex-row md:items-stretch lg:gap-12">
          {/* Sisi Kiri: Profil Bot / QR */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-stroke bg-gray-1 p-6 dark:border-dark-3 dark:bg-dark-2 md:w-60">
            {waQr && waStatus === "qr_ready" ? (
              <div className="flex flex-col items-center gap-3">
                <img src={waQr} alt="WhatsApp QR Code" className="h-40 w-40 rounded-lg shadow-sm" />
                <p className="text-[10px] font-bold text-dark-5 uppercase tracking-wider">Scan QR Code</p>
              </div>
            ) : waStatus === "ready" || waStatus === "authenticated" ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="relative">
                  {botInfo?.avatar ? (
                    <img
                      src={botInfo.avatar}
                      alt="Bot Avatar"
                      className="h-20 w-20 rounded-full border-2 border-stroke p-0.5 object-cover dark:border-dark-3"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border border-stroke shadow-sm dark:bg-dark-3 dark:border-dark-4">
                      <Icons.Whatsapp className="text-success" size={32} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-bold text-dark dark:text-white line-clamp-1">
                    {botInfo?.name || "WhatsApp Bot"}
                  </h4>
                  <p className="text-[10px] font-medium text-dark-5">
                    {botInfo?.number ? formatWhatsApp(botInfo.number) : "Connected"}
                  </p>
                </div>
              </div>
            ) : (
               <div className="flex flex-col items-center gap-3 text-center py-4">
                  <div className="rounded-full bg-gray-2 dark:bg-dark-3 p-5">
                    <Icons.QrCode className="text-dark-4 dark:text-dark-6" size={32} />
                  </div>
                  <p className="text-[10px] font-bold text-dark-5 uppercase tracking-widest text-dark-6">Memuat...</p>
               </div>
            )}
          </div>

          {/* Sisi Kanan: Status & Actions */}
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Current Status</span>
                <span className="h-px flex-1 bg-stroke dark:bg-dark-3"></span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold shadow-sm",
                  waStatus === "ready" || waStatus === "authenticated"
                    ? "bg-success/10 text-success border border-success/20"
                    : waStatus === "qr_ready" || waStatus === "initializing"
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : "bg-danger/10 text-danger border border-danger/20"
                )}>
                  <span className="uppercase tracking-tighter">{waStatus.replace("_", " ")}</span>
                </div>
                
                {waStatus === "ready" && (
                  <span className="text-[10px] font-medium text-dark-6 italic">
                    * Gateway aktif dan siap mengirim notifikasi.
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={isTestLoading || waStatus !== "ready"}
                className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-dark px-6 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 disabled:opacity-30 dark:bg-white dark:text-dark"
              >
                <Icons.Send size={18} className={cn("transition-transform group-hover:translate-x-1 group-hover:-translate-y-1", isTestLoading && "hidden")} />
                {isTestLoading ? (
                  <div className="flex items-center gap-2">
                    <Icons.RefreshCcw size={16} />
                    <span>Mengirim...</span>
                  </div>
                ) : (
                  "Uji Coba Kirim"
                )}
              </button>
              
              <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRestartLogout}
                disabled={isRestartLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-stroke bg-white px-6 py-3 text-sm font-bold text-dark transition-all hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3 sm:w-auto"
              >
                <Icons.RefreshCcw
                   size={18}
                   className={cn(isRestartLoading && "animate-spin")}
                />
                Restart / Logout
              </button>
            </div>
          </div>

            {waStatus === "disconnected" && (
              <div className="flex items-center gap-2 rounded-lg bg-danger/5 p-3 border border-danger/10">
                <Icons.Warning size={16} className="text-danger flex-shrink-0" />
                <p className="text-xs font-medium text-danger">
                  Koneksi terputus. Pastikan <code className="bg-danger/10 px-1 rounded">npm run wa:worker</code> sedang berjalan di server.
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Bagian Bawah: Grid 2 Kolom (Settings & Logs) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Kolom Kiri: Form Pengaturan (XL: Col 7) */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-6">
              <SectionCard title="Pengaturan Bot & Notifikasi">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-bold text-dark dark:text-white">
                        Fitur Bot WhatsApp
                      </label>
                      <p className="text-xs text-dark-5">
                        Aktifkan pengiriman otomatis notifikasi ke pelanggan dan admin.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={botEnabled}
                        onChange={(e) => setValue("wa_bot_enabled", e.target.checked)}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-2 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-dark-3"></div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-stroke pt-6 dark:border-dark-3">
                     <InputGroup
                      label="Nomor WA Admin"
                      placeholder="62812xxxx"
                      {...register("wa_target_number", {
                         onChange: (e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                         }
                      })}
                      error={errors.wa_target_number?.message}
                      disabled={saving}
                      required
                      leftIcon={<Icons.Whatsapp className="text-secondary" size={18} />}
                    />
                    <p className="text-[10px] text-dark-5 italic">
                      * Nomor ini akan menerima notifikasi stok menipis dll.
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Template Notifikasi Layanan">
                 <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-xs font-bold text-dark dark:text-white flex items-center gap-2">
                          <Icons.Warning size={14} className="text-secondary" /> Template Stok Menipis
                       </label>
                       <textarea
                          {...register("wa_template_stok")}
                          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent p-3 text-xs text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                          rows={2}
                          placeholder="Placeholder: {{item}}, {{sku}}, {{stock}}, {{min}}..."
                       />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-dark dark:text-white flex items-center gap-2">
                             <Icons.Repair size={14} className="text-secondary" /> Template Dikerjakan
                          </label>
                          <textarea
                             {...register("wa_template_dikerjakan")}
                             className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent p-3 text-xs text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                             rows={2}
                             placeholder="Gunakan {{plate}}..."
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold text-dark dark:text-white flex items-center gap-2">
                             <Icons.Success size={14} className="text-secondary" /> Template Selesai
                          </label>
                          <textarea
                             {...register("wa_template_selesai")}
                             className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent p-3 text-xs text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                             rows={2}
                             placeholder="Gunakan {{plate}}..."
                          />
                       </div>
                    </div>
                    <p className="text-[10px] text-dark-5 italic">
                      * Kosongkan untuk menggunakan template default sistem.
                    </p>
                 </div>
              </SectionCard>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-dark px-10 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 disabled:opacity-50 dark:bg-white dark:text-dark sm:w-auto"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>

        {/* Kolom Kanan: Log Notifikasi (XL: Col 5) */}
        <div className="xl:col-span-5 flex flex-col">
          <SectionCard title="Log Notifikasi WA" className="flex-1 flex flex-col">
            <div className="flex flex-col gap-3 h-full">
              <div className="flex justify-end">
                <button
                   onClick={handleClearLogs}
                   disabled={isClearingLogs || logs.length === 0}
                   className="flex items-center gap-1 text-[10px] font-bold text-danger hover:underline disabled:opacity-50"
                >
                   <Icons.Delete size={12} /> Hapus Semua Log
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[600px] pr-1 space-y-2">
                {loadingLogs ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex animate-pulse items-start justify-between gap-4 rounded-lg border border-stroke p-4 dark:border-dark-3"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-gray-2 dark:bg-dark-3" />
                        <div className="h-3 w-full rounded bg-gray-2 dark:bg-dark-3" />
                      </div>
                    </div>
                  ))
                ) : logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 border border-dashed border-stroke rounded-lg dark:border-dark-3 opacity-60">
                    <p className="text-sm text-dark-5">Belum ada riwayat</p>
                  </div>
                ) : (
                  logs.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex flex-col gap-2 rounded-lg border border-stroke p-4 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-2 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-dark dark:text-white uppercase tracking-tight">
                            {getNotifTitle(notif)}
                          </p>
                          <p className="text-[10px] text-dark-5">
                            {dayjs(notif.created_at).format("DD MMM YYYY, HH:mm")}
                          </p>
                        </div>
                        <Badge
                          variant={
                            notif.status === "sent"
                              ? "success"
                              : notif.status === "pending"
                                ? "warning"
                                : "danger"
                          }
                          className="text-[9px] px-2 py-0.5"
                        >
                          {notif.status === "sent"
                            ? "SENT"
                            : notif.status === "pending"
                              ? "WAIT"
                              : "FAIL"}
                        </Badge>
                      </div>

                      <div className="bg-gray-2 dark:bg-dark-3 rounded p-2">
                        <p
                          className="text-[11px] text-dark-4 dark:text-dark-6 line-clamp-2"
                          title={notif.message_body}
                        >
                          {notif.message_body}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[10px] font-medium text-dark-5">
                          To: <span className="text-secondary">{formatWhatsApp(notif.wa_number)}</span>
                        </p>
                        {notif.status === "failed" && (
                          <button
                            onClick={async () => {
                              try {
                                const { api } = await import("@/lib/api");
                                await api.post(`/api/v1/notifications/wa/retry/${notif.id}`);
                                Notify.toast("Memulai kirim ulang...");
                                fetchLogs();
                              } catch (err: any) {
                                Notify.alert("Gagal", err.message || "Gagal", "error");
                              }
                            }}
                            className="text-[10px] text-primary font-bold hover:underline"
                          >
                            Retry
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
