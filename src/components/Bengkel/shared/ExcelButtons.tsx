"use client";

import React, { useRef, useState } from "react";
import {
  Download,
  Upload,
  FileDown,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  downloadTemplate,
  exportToExcel,
  parseExcelImport,
  type ExcelModuleKey,
  type TemplateRow,
} from "@/lib/excel";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExcelButtonsProps {
  /** Key modul untuk schema kolom yang tepat */
  moduleKey: ExcelModuleKey;
  /** Data aktif di tabel untuk di-export */
  exportData: TemplateRow[];
  /** Callback saat import selesai diparse — parent yang implementasi */
  onImport?: (rows: TemplateRow[]) => void;
  /** Label suffix file export (opsional) */
  exportSuffix?: string;
  className?: string;
}

// ─── Import Preview Modal ─────────────────────────────────────────────────────

interface ImportPreviewProps {
  open: boolean;
  onClose: () => void;
  headers: string[];
  rows: TemplateRow[];
  errors: string[];
  onConfirm: (rows: TemplateRow[]) => void;
}

function ImportPreviewModal({
  open,
  onClose,
  headers,
  rows,
  errors,
  onConfirm,
}: ImportPreviewProps) {
  if (!open) return null;

  const previewRows = rows.slice(0, 5);
  const hasData = rows.length > 0 && errors.length === 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl dark:bg-gray-dark">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white">
              Preview Import Excel
            </h3>
            <p className="mt-0.5 text-xs font-medium text-dark-5">
              {hasData
                ? `${rows.length} baris ditemukan — pastikan kolom sudah benar`
                : "Terjadi masalah pada file"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:hover:bg-dark-3"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {errors.length > 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red/10 dark:text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div>
                {errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            </div>
          )}

          {hasData && (
            <>
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-dark-5">
                <CheckCircle2 size={14} className="text-green-500" />
                Menampilkan {previewRows.length} dari {rows.length} baris
                {rows.length > 5 && " (hanya preview 5 baris pertama)"}
              </div>
              <div className="overflow-x-auto rounded-xl border border-stroke dark:border-dark-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-stroke bg-gray-2/50 dark:border-dark-3 dark:bg-dark-3">
                      {headers.map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-left font-bold text-dark dark:text-white"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-stroke/50 last:border-0 dark:border-dark-3/50"
                      >
                        {headers.map((h) => (
                          <td
                            key={h}
                            className="whitespace-nowrap px-4 py-3 text-dark-5 dark:text-dark-6"
                          >
                            {String(row[h] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-stroke px-6 py-4 dark:border-dark-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-stroke px-5 py-2.5 text-sm font-bold text-dark-5 hover:border-dark hover:text-dark dark:border-dark-3 dark:text-dark-6 dark:hover:border-white dark:hover:text-white"
          >
            Batal
          </button>
          {hasData && (
            <button
              onClick={() => {
                onConfirm(rows);
                onClose();
              }}
              className="flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-sm font-bold text-white hover:bg-dark/90"
            >
              <Upload size={15} />
              Import {rows.length} Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ExcelButtons({
  moduleKey,
  exportData,
  onImport,
  exportSuffix,
  className,
}: ExcelButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    open: boolean;
    headers: string[];
    rows: TemplateRow[];
    errors: string[];
  }>({ open: false, headers: [], rows: [], errors: [] });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await parseExcelImport(file);
      setPreview({
        open: true,
        headers: result.headers,
        rows: result.data,
        errors: result.errors,
      });
    } finally {
      setLoading(false);
      // Reset input so user can re-pick same file
      e.target.value = "";
    }
  };

  const handleConfirmImport = (rows: TemplateRow[]) => {
    onImport?.(rows);
  };

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Download Template */}
        <button
          onClick={() => downloadTemplate(moduleKey)}
          title="Download template Excel kosong"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-stroke bg-white px-3 text-xs font-bold text-dark-5 transition-colors hover:border-primary hover:text-primary dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:border-primary dark:hover:text-primary"
        >
          <FileDown size={14} />
          <span className="hidden sm:inline">Template</span>
        </button>

        {/* Import via file picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          title="Import data dari file Excel"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-stroke bg-white px-3 text-xs font-bold text-dark-5 transition-colors hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:border-blue-400 dark:hover:text-blue-400"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          <span className="hidden sm:inline">Import</span>
        </button>

        {/* Export current data */}
        <button
          onClick={() => exportToExcel(moduleKey, exportData, exportSuffix)}
          disabled={exportData.length === 0}
          title={`Export ${exportData.length} data ke Excel`}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-stroke bg-white px-3 text-xs font-bold text-dark-5 transition-colors hover:border-green-500 hover:text-green-600 disabled:opacity-40 dark:border-dark-3 dark:bg-dark-2 dark:text-dark-6 dark:hover:border-green-400 dark:hover:text-green-400"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
          {exportData.length > 0 && (
            <span className="ml-1 rounded-full bg-gray-2 px-1.5 py-0.5 text-[10px] font-bold text-dark dark:bg-dark-3 dark:text-white">
              {exportData.length}
            </span>
          )}
        </button>
      </div>

      <ImportPreviewModal
        open={preview.open}
        onClose={() => setPreview((p) => ({ ...p, open: false }))}
        headers={preview.headers}
        rows={preview.rows}
        errors={preview.errors}
        onConfirm={handleConfirmImport}
      />
    </>
  );
}
