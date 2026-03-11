"use client";

import { useState, useEffect } from "react";
import { ServiceRecord } from "@/types/service-history";
import { formatNumber } from "@/utils/format-number";
import { Badge } from "@/features/shared";
import { Icons } from "@/components/Icons";
import dayjs from "dayjs";

interface ServiceHistoryModalProps {
  noPolisi: string;
  kendaraan: string;
  onClose: () => void;
}

function ServiceDetailRow({ record }: { record: ServiceRecord }) {
  const [open, setOpen] = useState(false);
  const isGaransiActive =
    record.garansiHingga && dayjs(record.garansiHingga).isAfter(dayjs());

  return (
    <div className="rounded-xl border border-stroke dark:border-dark-3 overflow-hidden">
      {/* Header row */}
      <button
        className="flex w-full items-center justify-between p-4 hover:bg-gray-1 dark:hover:bg-dark-3 transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icons.Repair size={18} />
          </div>
          <div>
            <p className="font-bold text-sm text-dark dark:text-white">
              {record.layanan}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-dark-5">
                {dayjs(record.tanggal).format("DD MMM YYYY")}
              </span>
              <span className="text-[11px] text-dark-5">•</span>
              <span className="text-[11px] text-dark-5">
                {record.odometer.toLocaleString("id-ID")} km
              </span>
              <span className="text-[11px] text-dark-5">•</span>
              <span className="text-[11px] font-semibold text-dark-5">
                Teknisi: {record.teknisi}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isGaransiActive && (
            <Badge variant="success" className="text-[9px] hidden sm:flex">
              Garansi s/d {dayjs(record.garansiHingga).format("DD/MM/YY")}
            </Badge>
          )}
          <p className="font-black text-secondary text-sm">
            Rp {formatNumber(record.totalBiaya)}
          </p>
          {open ? (
            <Icons.ChevronUp size={16} className="text-dark-5" />
          ) : (
            <Icons.ChevronDown size={16} className="text-dark-5" />
          )}
        </div>
      </button>

      {/* Expandable detail */}
      {open && (
        <div className="border-t border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-3 p-4">
          <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Items */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-dark-5">
                Item & Jasa
              </p>
              <div className="space-y-1">
                {record.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-dark dark:text-white">
                      {item.nama} x{item.qty}
                    </span>
                    <span className="font-semibold text-dark-5">
                      Rp {formatNumber(item.harga * item.qty)}
                    </span>
                  </div>
                ))}
                <div className="mt-2 flex justify-between border-t border-stroke dark:border-dark-3 pt-2 font-bold text-sm">
                  <span className="text-dark dark:text-white">Total</span>
                  <span className="text-secondary">
                    Rp {formatNumber(record.totalBiaya)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes & Warranty */}
            <div className="space-y-2">
              {record.catatan && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-dark-5">
                    Catatan Teknisi
                  </p>
                  <p className="text-sm text-dark dark:text-white rounded-lg bg-white dark:bg-dark-2 p-2.5 border border-stroke dark:border-dark-3">
                    {record.catatan}
                  </p>
                </div>
              )}
              {record.garansiHingga && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wider text-dark-5">
                    Garansi Servis
                  </p>
                  <div
                    className={`flex items-center gap-2 rounded-lg p-2.5 text-sm border ${
                      isGaransiActive
                        ? "bg-green-light-1 border-green/20 text-green"
                        : "bg-gray-2 dark:bg-dark-2 border-stroke dark:border-dark-3 text-dark-5 line-through"
                    }`}
                  >
                    <Icons.Success size={14} />
                    Berlaku hingga{" "}
                    {dayjs(record.garansiHingga).format("DD MMMM YYYY")}
                    {!isGaransiActive && " (Kadaluarsa)"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ServiceHistoryModal({
  noPolisi,
  kendaraan,
  onClose,
}: ServiceHistoryModalProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { api } = await import("@/lib/api");
        const res = await api.get<any>(`/api/v1/transactions?plate_number=${noPolisi}`);
        const mapped = (res.data || []).map((t: any) => ({
          id: t.id.toString(),
          noPolisi: t.vehicles?.plate_number || noPolisi,
          tanggal: t.transaction_date,
          layanan: t.notes || "Servis Reguler",
          odometer: t.vehicles?.year ? 15000 : 12450, 
          teknisi: t.user?.name || "Montir", 
          totalBiaya: Number(t.total_amount),
          items: (t.transaction_items || []).map((ti: any) => ({
            nama: ti.item_name,
            qty: ti.quantity,
            harga: Number(ti.unit_price)
          })),
          catatan: t.notes
        })).sort((a: any, b: any) => dayjs(b.tanggal).unix() - dayjs(a.tanggal).unix());
        
        setRecords(mapped);
      } catch (err) {
        console.error("Failed to load service history", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [noPolisi]);

  const totalSpent = records.reduce((acc, r) => acc + r.totalBiaya, 0);
  const lastOdometer = records[0]?.odometer ?? 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-dark flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-6 py-4">
          <div>
            <h3 className="text-lg font-black text-white">
              Riwayat Servis — {noPolisi}
            </h3>
            <p className="text-sm text-white/70">{kendaraan}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 border-b border-stroke dark:border-dark-3 bg-gray-1 dark:bg-dark-2">
          <div className="text-center">
            <p className="text-lg font-black text-dark dark:text-white">
              {records.length}x
            </p>
            <p className="text-[11px] text-dark-5">Total Kunjungan</p>
          </div>
          <div className="text-center border-x border-stroke dark:border-dark-3">
            <p className="text-lg font-black text-secondary">
              Rp {formatNumber(totalSpent)}
            </p>
            <p className="text-[11px] text-dark-5">Total Pengeluaran</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black text-dark dark:text-white">
              {lastOdometer.toLocaleString("id-ID")} km
            </p>
            <p className="text-[11px] text-dark-5">Odometer Terakhir</p>
          </div>
        </div>

        {/* Records */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-16 text-dark-5">
               <p className="text-sm">Vroong... Loading riwayat servis...</p>
             </div>
          ) : records.length > 0 ? (
            records.map((record: any) => (
              <ServiceDetailRow key={record.id} record={record} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-dark-5">
              <Icons.History size={40} className="mb-2 opacity-30" />
              <p className="text-sm">Belum ada riwayat servis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
