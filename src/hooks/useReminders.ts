"use client";
import { useState, useEffect, useCallback } from "react";
import { remindersService, ApiReminder, CreateReminderBody } from "@/services/reminders.service";
import { Notify } from "@/utils/notify";

export function useReminders() {
  const [data, setData] = useState<ApiReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await remindersService.getAll();
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data reminder");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const sendWa = async (id: string) => {
    try {
      Notify.loading("Mengirim pesan pengingat...");
      await remindersService.sendWa(id);
      Notify.toast("Pesan pengingat berhasil ditambahkan ke antrean", "success");
      await fetchAll();
    } catch (err: any) {
      Notify.alert("Gagal Kirim", err.message || "Gagal mengirim pengingat", "error");
    } finally {
      Notify.close();
    }
  };

  const createReminder = async (formData: CreateReminderBody) => {
    try {
      await remindersService.create(formData);
      await fetchAll();
      Notify.toast("Reminder berhasil dibuat", "success");
    } catch (err: any) {
      Notify.alert("Gagal Simpan", err.message || "Gagal membuat reminder", "error");
      throw err;
    }
  };

  const updateReminder = async (id: string, formData: Partial<CreateReminderBody>) => {
    try {
      await remindersService.update(id, formData);
      await fetchAll();
      Notify.toast("Reminder berhasil diupdate", "success");
    } catch (err: any) {
      Notify.alert("Gagal Update", err.message || "Gagal mengupdate reminder", "error");
      throw err;
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      await remindersService.delete(id);
      await fetchAll();
      Notify.toast("Reminder berhasil dihapus", "success");
    } catch (err: any) {
      Notify.alert("Gagal Hapus", err.message || "Gagal menghapus reminder", "error");
    }
  };

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchAll, 
    sendWa, 
    createReminder, 
    updateReminder, 
    deleteReminder 
  };
}
