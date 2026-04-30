"use client";

import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Antrean } from "@/types/antrean";
import {
  antreanService,
  InspectionStatus,
  WorkOrderInspection,
  WorkOrderInspectionItem,
} from "@/services/antrean.service";
import { Notify } from "@/utils/notify";
import { printElement } from "@/utils/print";
import { cn } from "@/lib/utils";

interface InspectionChecklistModalProps {
  item: Antrean;
  onClose: () => void;
}

const statusOptions: { value: InspectionStatus; label: string }[] = [
  { value: "baik", label: "Baik" },
  { value: "repair_replace", label: "Repair/Replace" },
];

function groupItems(items: WorkOrderInspectionItem[]) {
  return items.reduce<Record<string, WorkOrderInspectionItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});
}

export function InspectionChecklistModal({ item, onClose }: InspectionChecklistModalProps) {
  const [inspection, setInspection] = useState<WorkOrderInspection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const groupedItems = useMemo(
    () => groupItems(inspection?.items ?? []),
    [inspection?.items],
  );

  const checkedCount = useMemo(
    () => (inspection?.items ?? []).filter((i) => i.status !== "unchecked").length,
    [inspection?.items],
  );

  useEffect(() => {
    let mounted = true;

    async function loadInspection() {
      try {
        const data = await antreanService.getInspection(item.id);
        if (mounted) setInspection(data);
      } catch (error: any) {
        Notify.alert("Gagal Membuka Inspeksi", error.message || "Checklist inspeksi tidak bisa dimuat.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadInspection();
    return () => {
      mounted = false;
    };
  }, [item.id]);

  const updateHeader = (key: keyof WorkOrderInspection, value: string) => {
    setInspection((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateItem = (id: number, patch: Partial<Pick<WorkOrderInspectionItem, "status" | "note">>) => {
    setInspection((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((inspectionItem) =>
              inspectionItem.id === id ? { ...inspectionItem, ...patch } : inspectionItem,
            ),
          }
        : prev,
    );
  };

  const handleSave = async () => {
    if (!inspection) return;
    setIsSaving(true);
    try {
      const saved = await antreanService.updateInspection(item.id, {
        inspection_date: inspection.inspection_date,
        kilometer: inspection.kilometer ?? "",
        pengerjaan: inspection.pengerjaan ?? "",
        service_request_note: inspection.service_request_note ?? "",
        repair_note: inspection.repair_note ?? "",
        inspected_by: inspection.inspected_by ?? item.mekanik ?? "",
        items: inspection.items.map((inspectionItem) => ({
          id: inspectionItem.id,
          status: inspectionItem.status,
          note: inspectionItem.note ?? "",
        })),
      });
      setInspection(saved);
      Notify.toast("Checklist inspeksi tersimpan", "success");
    } catch (error: any) {
      Notify.alert("Gagal Menyimpan", error.message || "Periksa data inspeksi lalu coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    printElement(
      "inspection-checklist-print",
      `Inspection Checklist - ${item.noPolisi}`,
      `
      @page { size: A4 portrait; margin: 10mm; }
      body { font-size: 11px; }
      .inspection-paper { box-shadow: none !important; border: 1px solid #d7d7d7 !important; padding: 10mm !important; }
      .inspection-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 8px 18px !important; }
      .inspection-section { break-inside: avoid; page-break-inside: avoid; }
      .inspection-table { table-layout: fixed !important; width: 100% !important; }
      .inspection-table th, .inspection-table td { padding: 3px 5px !important; vertical-align: top !important; }
      .inspection-notes { min-height: 115px !important; }
      `,
    );
  };

  return (
    <BaseModal
      title="Inspection Check List"
      description={`${item.noPolisi} - ${item.pelanggan}`}
      icon={<Icons.StockOpname size={20} />}
      maxWidth="4xl"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <ActionButton
            variant="ghost"
            label="Tutup"
            onClick={onClose}
            className="w-full"
          />
          <ActionButton
            variant="outline"
            label="Cetak"
            icon={<Icons.Print size={18} />}
            onClick={handlePrint}
            disabled={!inspection}
            className="w-full"
          />
          <ActionButton
            variant="primary"
            label="Simpan Checklist"
            icon={<Icons.Check size={18} />}
            onClick={handleSave}
            loading={isSaving}
            disabled={!inspection || isLoading}
            className="w-full"
          />
        </div>
      }
    >
      {isLoading ? (
        <div className="flex min-h-[360px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stroke border-t-dark" />
        </div>
      ) : inspection ? (
        <div id="inspection-checklist-print" className="inspection-paper rounded-lg border border-stroke bg-white p-4 text-dark shadow-sm dark:border-dark-3 dark:bg-gray-dark dark:text-white">
          <div className="mb-5 text-center">
            <h2 className="text-lg font-black uppercase tracking-wide">
              Inspection Check List - Bengkel Progo Auto Service
            </h2>
            <p className="mt-1 text-xs font-semibold text-dark-5">
              {checkedCount}/{inspection.items.length} item sudah dicek
            </p>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 rounded-lg border border-stroke p-3 dark:border-dark-3 md:grid-cols-2">
            <Field label="Customer" value={item.pelanggan} readOnly />
            <Field
              label="Tanggal"
              value={dayjs(inspection.inspection_date).format("YYYY-MM-DD")}
              type="date"
              onChange={(value) => updateHeader("inspection_date", value)}
            />
            <Field label="Kendaraan" value={item.kendaraan} readOnly />
            <Field
              label="Mekanik"
              value={inspection.inspected_by ?? item.mekanik ?? ""}
              onChange={(value) => updateHeader("inspected_by", value)}
              placeholder="Nama mekanik"
            />
            <Field label="No. Plat" value={item.noPolisi} readOnly />
            <Field
              label="Keluhan"
              value={item.keluhan ?? ""}
              readOnly
            />
            <Field
              label="Kilometer"
              value={inspection.kilometer ?? ""}
              onChange={(value) => updateHeader("kilometer", value)}
              placeholder="Contoh: 82.500"
            />
            <Field
              label="Pengerjaan"
              value={inspection.pengerjaan ?? ""}
              onChange={(value) => updateHeader("pengerjaan", value)}
              placeholder="Contoh: Tune up / General check"
            />
          </div>

          <div className="inspection-grid grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Object.entries(groupedItems).map(([section, sectionItems]) => (
              <InspectionSection
                key={section}
                section={section}
                items={sectionItems}
                onStatusChange={(id, status) => updateItem(id, { status })}
                onNoteChange={(id, note) => updateItem(id, { note })}
              />
            ))}

            <div className="inspection-section space-y-4">
              <NoteBox
                label="Permintaan Service / yang telah dikerjakan"
                value={inspection.service_request_note ?? ""}
                onChange={(value) => updateHeader("service_request_note", value)}
              />
              <NoteBox
                label="Catatan Perbaikan"
                value={inspection.repair_note ?? ""}
                onChange={(value) => updateHeader("repair_note", value)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </BaseModal>
  );
}

interface FieldProps {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function Field({ label, value, type = "text", placeholder, readOnly, onChange }: FieldProps) {
  return (
    <label className="grid grid-cols-[104px_1fr] items-center gap-2 text-sm">
      <span className="font-bold text-dark-5">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className={cn(
          "h-9 rounded-md border border-stroke bg-white px-3 text-sm font-semibold text-dark outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white",
          readOnly && "bg-gray-1 text-dark-5 dark:bg-dark-3",
        )}
      />
    </label>
  );
}

interface InspectionSectionProps {
  section: string;
  items: WorkOrderInspectionItem[];
  onStatusChange: (id: number, status: InspectionStatus) => void;
  onNoteChange: (id: number, note: string) => void;
}

function InspectionSection({ section, items, onStatusChange, onNoteChange }: InspectionSectionProps) {
  return (
    <section className="inspection-section overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
      <div className="bg-gray-2 px-3 py-2 dark:bg-dark-2">
        <h3 className="text-xs font-black uppercase tracking-wide text-dark dark:text-white">
          {section}
        </h3>
      </div>
      <div>
        <table className="inspection-table w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[34px]" />
            <col />
            <col className="w-[74px]" />
            <col className="w-[112px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-stroke text-left text-[11px] uppercase text-dark-5 dark:border-dark-3">
              <th className="px-2 py-2">No</th>
              <th className="px-3 py-2">Item</th>
              <th className="px-2 py-2 text-center">Baik</th>
              <th className="px-2 py-2 text-center leading-tight">Repair/<br />Replace</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-b border-stroke last:border-b-0 dark:border-dark-3">
                <td className="px-2 py-2 align-top text-xs font-black text-dark-5">{index + 1}</td>
                <td className="px-3 py-2 align-top">
                  <div className="break-words font-semibold leading-snug text-dark dark:text-white">{item.item_name}</div>
                  {item.status === "repair_replace" && (
                    <input
                      value={item.note ?? ""}
                      onChange={(event) => onNoteChange(item.id, event.target.value)}
                      placeholder="Catatan item"
                      className="mt-2 h-8 w-full rounded-md border border-stroke px-2 text-xs outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2"
                    />
                  )}
                </td>
                {statusOptions.map((option) => (
                  <td key={option.value} className="px-2 py-2 align-top">
                    <button
                      type="button"
                      onClick={() => onStatusChange(item.id, item.status === option.value ? "unchecked" : option.value)}
                      className={cn(
                        "mx-auto flex h-8 w-full items-center justify-center rounded-md border px-1 text-[10px] font-black transition-colors",
                        item.status === option.value
                          ? option.value === "baik"
                            ? "border-green-500 bg-green-50 text-green-600"
                            : "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-stroke text-dark-5 hover:border-dark dark:border-dark-3 dark:hover:border-white",
                      )}
                    >
                      {item.status === option.value ? <Icons.Check size={15} /> : option.label}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

interface NoteBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function NoteBox({ label, value, onChange }: NoteBoxProps) {
  return (
    <label className="block rounded-lg border border-stroke p-3 dark:border-dark-3">
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-dark dark:text-white">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="inspection-notes min-h-[150px] w-full resize-none rounded-md border border-stroke bg-white p-3 text-sm outline-none focus:border-dark dark:border-dark-3 dark:bg-dark-2 dark:text-white"
      />
    </label>
  );
}
