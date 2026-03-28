"use client";

import React, { useState } from "react";
import { Icons } from "@/components/Icons";
import { Antrean } from "@/types/antrean";
import dayjs from "dayjs";
import { BaseModal, ActionButton } from "@/features/shared";
import { antreanService } from "@/services/antrean.service";

interface SPKModalProps {
  item: Antrean;
  onClose: () => void;
  onChecklistUpdate?: (updatedItem: Antrean) => void;
}

export function SPKModal({ item, onClose, onChecklistUpdate }: SPKModalProps) {
  const [checklists, setChecklists] = useState(item.checklists ?? []);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleToggleChecklist = async (checklistId: number, currentDone: boolean) => {
    setUpdatingId(checklistId);
    try {
      await antreanService.updateChecklist(item.id, checklistId, !currentDone);
      setChecklists((prev) =>
        prev.map((c) => (c.id === checklistId ? { ...c, is_done: !currentDone } : c))
      );
    } catch (e) {
      console.error("Gagal update checklist", e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <BaseModal
      title="Surat Perintah Kerja (SPK)"
      description={`Detail instruksi servis untuk unit ${item.noPolisi}`}
      icon={<Icons.Print size={20} />}
      onClose={onClose}
      maxWidth="lg"
      footer={
        <div className="flex w-full gap-3 no-print">
          <ActionButton
            variant="ghost"
            label="Tutup"
            onClick={onClose}
            className="flex-1"
          />
          <ActionButton
            variant="primary"
            label="Cetak SPK"
            icon={<Icons.Print size={18} />}
            onClick={handlePrint}
            className="flex-1 bg-dark text-white"
          />
        </div>
      }
    >
      <div id="spk-content" className="space-y-6 py-2">
        {/* Header SPK */}
        <div className="flex items-start justify-between border-b-2 border-dark pb-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">AUTO<span className="text-secondary italic">SERVICE</span></h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Premium Garage & Care</p>
          </div>
          <div className="text-right">
            <div className="bg-dark text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-1">SPK / Antrean</div>
            <p className="text-sm font-black text-dark uppercase">{item.id}/{dayjs().format('MM/YY')}</p>
          </div>
        </div>

        {/* Info Utama */}
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-stroke dark:border-dark-3 dark:bg-dark-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Data Kendaraan</p>
            <p className="text-lg font-black text-dark dark:text-white tracking-widest uppercase">{item.noPolisi}</p>
            <p className="text-xs font-medium text-dark-5">
              {item.kendaraan ? item.kendaraan : '(Detail Kendaraan Belum Ada)'} ({item.tipe})
            </p>
            {item.noRangka && (
              <p className="text-[10px] font-bold text-dark-5 uppercase tracking-tighter mt-1 bg-white/50 px-1.5 py-0.5 rounded border border-stroke dark:border-dark-3 inline-block">
                VIN: {item.noRangka}
              </p>
            )}
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Pemilik / Customer</p>
            <p className="text-sm font-bold text-dark dark:text-white uppercase">{item.pelanggan}</p>
            <p className="text-xs font-medium text-dark-5 mt-1">WA: {item.waPelanggan || '-'}</p>
            <p className="text-xs font-medium text-dark-5">Masuk: {dayjs(item.waktuMasuk).format('DD/MM/YYYY HH:mm')}</p>
            {item.menginap && (
              <span className="inline-block mt-2 rounded bg-danger/10 px-2 py-1 text-[10px] font-black text-danger uppercase tracking-widest">
                Unit / Kendaraan Menginap
              </span>
            )}
          </div>
        </div>

        {/* Keluhan & Instruksi Pekerjaan */}
        <div className="space-y-4 border-b border-stroke pb-4 dark:border-dark-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icons.Kasir size={16} className="text-dark-5" />
              <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Keluhan Pelanggan</h4>
            </div>
            <div className="rounded-lg bg-gray-1 p-3 dark:bg-dark-2">
              <p className="text-sm font-medium text-dark dark:text-gray-4 italic">
                "{item.keluhan || 'Tidak ada catatan keluhan spesifik.'}"
              </p>
            </div>
          </div>
          {item.complaintLog && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icons.Edit size={16} className="text-dark-5" />
                <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Log Keluhan Detail</h4>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 dark:bg-dark-2 dark:border-dark-3">
                <p className="text-sm font-medium text-dark dark:text-gray-4">{item.complaintLog}</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icons.Repair size={16} className="text-dark-5" />
              <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Instruksi Layanan / Pekerjaan</h4>
            </div>
            <div className="min-h-[60px] rounded-lg border-2 border-dashed border-stroke p-3 dark:border-dark-3">
              <p className="text-sm font-bold text-dark dark:text-white">{item.layanan}</p>
            </div>
          </div>
        </div>

        {/* Estimasi Biaya */}
        {item.estimasiBiaya ? (
          <div className="flex justify-between items-center rounded-xl bg-gray-50 p-4 border border-stroke dark:border-dark-3 dark:bg-dark-2">
            <p className="text-xs font-bold uppercase tracking-widest text-dark-5">Estimasi Biaya Dasar</p>
            <p className="text-lg font-black text-dark dark:text-white">
              Rp {item.estimasiBiaya.toLocaleString('id-ID')}
            </p>
          </div>
        ) : null}

        {/* Checklist dari Service Bundle */}
        {checklists.length > 0 && (
          <div className="space-y-3 border-t border-stroke pt-4 dark:border-dark-3">
            <div className="flex items-center gap-2">
              <Icons.Inventory size={16} className="text-dark-5" />
              <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">
                Checklist Pekerjaan
                <span className="ml-2 text-dark-5 font-normal normal-case">
                  ({checklists.filter((c) => c.is_done).length}/{checklists.length} selesai)
                </span>
              </h4>
            </div>
            <div className="space-y-2">
              {checklists.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  disabled={updatingId === c.id}
                  onClick={() => handleToggleChecklist(c.id, c.is_done)}
                  className="flex w-full items-center gap-3 rounded-lg border border-stroke px-3 py-2 text-left transition-colors hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3 no-print-interactive"
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    c.is_done
                      ? "border-secondary bg-secondary text-white"
                      : "border-stroke dark:border-dark-3"
                  }`}>
                    {c.is_done && <Icons.Check size={12} />}
                    {updatingId === c.id && (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    c.is_done ? "text-dark-5 line-through" : "text-dark dark:text-white"
                  }`}>
                    {c.task_name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Catatan Mekanik (empty area for print) */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-stroke pb-2 dark:border-dark-3">
              <Icons.Inventory size={16} className="text-dark-5" />
              <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Sparepart Dibutuhkan</h4>
            </div>
            <div className="h-24 rounded-lg border border-stroke dark:border-dark-3"></div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-stroke pb-2 dark:border-dark-3">
              <Icons.Edit size={16} className="text-dark-5" />
              <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Catatan Mekanik</h4>
            </div>
            <div className="h-24 rounded-lg border border-stroke dark:border-dark-3"></div>
          </div>
        </div>

        {/* Tanda Tangan */}
        <div className="grid grid-cols-3 gap-4 pt-8 text-center">
          <div className="space-y-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Customer</p>
            <div className="border-t border-stroke pt-1 mx-4 dark:border-dark-3"></div>
          </div>
          <div className="space-y-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Mekanik</p>
            <div className="border-t border-stroke pt-1 mx-4 dark:border-dark-3">
               <p className="text-[10px] font-bold text-dark-5 mt-1">{item.mekanik || '(Belum Ditugaskan)'}</p>
            </div>
          </div>
          <div className="space-y-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Service Advisor</p>
            <div className="border-t border-stroke pt-1 mx-4 dark:border-dark-3"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #spk-content, #spk-content * {
            visibility: visible;
          }
          #spk-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </BaseModal>
  );
}
