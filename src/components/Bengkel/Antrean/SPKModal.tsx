"use client";

import React from "react";
import { Icons } from "@/components/Icons";
import { Antrean } from "@/mock/antrean";
import dayjs from "dayjs";
import { BaseModal } from "../shared/BaseModal";
import { ActionButton } from "../shared/ActionButton";

interface SPKModalProps {
  item: Antrean;
  onClose: () => void;
}

export function SPKModal({ item, onClose }: SPKModalProps) {
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
            <p className="text-xs font-medium text-dark-5">{item.kendaraan} ({item.tipe})</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-dark-5">Pemilik / Customer</p>
            <p className="text-sm font-bold text-dark dark:text-white uppercase">{item.pelanggan}</p>
            <p className="text-xs font-medium text-dark-5">Masuk: {dayjs(item.waktuMasuk).format('DD/MM/YYYY HH:mm')}</p>
          </div>
        </div>

        {/* Instruksi Pekerjaan */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-stroke pb-2 dark:border-dark-3">
            <Icons.Repair size={16} className="text-dark-5" />
            <h4 className="text-xs font-black uppercase tracking-widest text-dark dark:text-white">Deskripsi Pekerjaan</h4>
          </div>
          <div className="min-h-[100px] rounded-xl border-2 border-dashed border-stroke p-4 dark:border-dark-3">
            <p className="text-sm font-bold text-dark dark:text-white">{item.layanan}</p>
          </div>
        </div>

        {/* Checklist & Catatan Mekanik */}
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
