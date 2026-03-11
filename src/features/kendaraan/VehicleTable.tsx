"use client";

import { Notify } from "@/utils/notify";
import { useState, useMemo, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/DataTable";
import { Vehicle } from "@/types/vehicle";
import { useVehicles } from "@/hooks/useVehicles";
import { Icons } from "@/components/Icons";
import { ActionButton, ExcelButtons } from "@/features/shared";
import { ServiceHistoryModal } from "@/features/shared";
import { VehicleFormModal } from "@/features/kendaraan";
import { kendaraanToExcelRows } from "@/lib/excel";

export function VehicleTable() {
  const {
    data: vehicles,
    loading,
    error,
    refetch,
    addVehicle,
    updateVehicle,
  } = useVehicles();
  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Show error toast when API fails
  useEffect(() => {
    if (error) {
      Notify.alert("Gagal", `Gagal memuat kendaraan: ${error}`, "error");
    }
  }, [error]);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      if (editVehicle) {
        await updateVehicle(editVehicle.id, {
          plate_number: data.plate_number,
          type: data.type,
          brand: data.brand,
          model: data.model,
          year: data.year,
        });
        Notify.toast("Kendaraan berhasil diperbarui!");
      } else {
        if (!data.customer_id) {
          Notify.alert("Gagal", "Pilih pemilik kendaraan terlebih dahulu!", "error");
          return;
        }
        await addVehicle(data.customer_id, {
          plate_number: data.plate_number,
          type: data.type,
          brand: data.brand,
          model: data.model,
          year: data.year,
        });
        Notify.toast("Kendaraan berhasil didaftarkan!");
      }
      setShowRegModal(false);
      setEditVehicle(null);
    } catch (err) {
      Notify.alert("Gagal", err instanceof Error ? err.message : "Gagal menyimpan kendaraan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        accessorKey: "plateNumber",
        header: "No. Polisi",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-stroke bg-gray-2 text-dark dark:border-dark-4 dark:bg-dark-3 dark:text-white">
                {v.type === "Mobil" ? (
                  <Icons.KendaraanMobil size={22} />
                ) : (
                  <Icons.KendaraanMotor size={22} />
                )}
              </div>
              <span className="text-lg font-bold uppercase leading-none text-dark dark:text-white">
                {v.plateNumber}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "brand",
        header: "Unit / Merk",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-tight text-dark dark:text-white">
                {v.brand} {v.model}
              </p>
              <span className="text-xs font-medium text-dark-5">{v.color}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "ownerId",
        header: "Pemilik",
        cell: ({ row }) => {
          const v = row.original;
          return (
            <div className="flex flex-col">
              <p className="text-sm font-bold leading-tight text-dark dark:text-white">
                {v.ownerName || "—"}
              </p>
              <span className="text-xs font-medium text-dark-5">
                ID: {v.ownerId}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "year",
        header: () => <div className="w-full text-center">Tahun</div>,
        cell: ({ row }) => (
          <div className="flex w-full justify-center font-bold text-dark dark:text-white">
            {row.original.year}
          </div>
        ),
      },
      {
        accessorKey: "lastServiceKm",
        header: () => <div className="w-full text-center">Odo Terakhir</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-1.5 text-sm font-bold text-secondary">
            <Icons.Repair size={14} />
            {row.original.lastServiceKm.toLocaleString()}{" "}
            <span className="text-[10px] font-medium text-dark-5">KM</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-full text-center">Opsi</div>,
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2">
            <ActionButton
              onClick={() => setHistoryVehicle(row.original)}
              variant="view"
              icon={<Icons.History size={16} />}
              title="Riwayat Servis"
            />
            <ActionButton
              icon={<Icons.Edit size={16} />}
              variant="edit"
              onClick={() => setEditVehicle(row.original)}
              title="Edit Kendaraan"
            />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={vehicles || []}
        isLoading={loading}
        searchable={["plateNumber", "brand", "model"]}
        searchPlaceholder="Cari plat nomor atau merk..."
        title="Data Kendaraan & Service Book"
        description="Daftar seluruh kendaraan pelanggan beserta riwayat servis"
        pageSize={5}
        primaryAction={{
          label: "Registrasi Baru",
          onClick: () => setShowRegModal(true),
        }}
        extraActions={
          <ExcelButtons
            moduleKey="kendaraan"
            exportData={kendaraanToExcelRows(vehicles) as any}
            onImport={(rows) => console.log("Import kendaraan:", rows)}
          />
        }
      />

      {historyVehicle && (
        <ServiceHistoryModal
          noPolisi={historyVehicle.plateNumber}
          kendaraan={`${historyVehicle.brand} ${historyVehicle.model}`}
          onClose={() => setHistoryVehicle(null)}
        />
      )}

      {(showRegModal || editVehicle) && (
        <VehicleFormModal
          mode={editVehicle ? "edit" : "create"}
          initialData={editVehicle || undefined}
          onClose={() => {
            setShowRegModal(false);
            setEditVehicle(null);
          }}
          onSave={handleSave}
          isLoading={isSaving}
        />
      )}
    </>
  );
}
