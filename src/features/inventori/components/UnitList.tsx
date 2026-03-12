"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ActionButton, ConfirmDeleteModal, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import { Notify } from "@/utils/notify";
import InputGroup from "@/components/ui/InputGroup";

const DEFAULT_UNITS = ["pcs", "liter", "set", "unit", "botol", "box", "roll"];

const unitSchema = z.object({
  name: z.string().min(1, "Nama satuan wajib diisi").max(20, "Maksimal 20 karakter"),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface UnitData {
  id: string;
  name: string;
}

export function UnitList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const showModalParam = searchParams.get("modal") === "unit";

  const [units, setUnits] = useState<UnitData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<UnitData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
  });

  const formValues = watch();

  // URL State sync
  useEffect(() => {
    if (showModalParam) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [showModalParam]);

  const updateQueryParams = (show: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (show) {
      params.set("modal", "unit");
    } else {
      params.delete("modal");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Draft Persistence
  useEffect(() => {
    const draft = localStorage.getItem("unit_form_draft");
    if (draft && showForm) {
      setValue("name", draft);
    }
  }, [showForm, setValue]);

  useEffect(() => {
    if (showForm && formValues.name) {
      localStorage.setItem("unit_form_draft", formValues.name);
    }
  }, [formValues.name, showForm]);

  useEffect(() => {
    const saved = localStorage.getItem("master_units");
    if (saved) {
      setUnits(JSON.parse(saved));
    } else {
      const initial = DEFAULT_UNITS.map((u, i) => ({ id: (i + 1).toString(), name: u }));
      setUnits(initial);
      localStorage.setItem("master_units", JSON.stringify(initial));
    }
  }, []);

  const saveUnits = (newUnits: UnitData[]) => {
    setUnits(newUnits);
    localStorage.setItem("master_units", JSON.stringify(newUnits));
  };

  const handleAdd = (data: UnitFormValues) => {
    if (units.some(u => u.name.toLowerCase() === data.name.trim().toLowerCase())) {
      Notify.alert("Gagal", "Satuan sudah ada dalam daftar", "error");
      return;
    }

    Notify.loading("Menambahkan satuan...");
    
    setTimeout(() => {
      const newUnit = { id: Date.now().toString(), name: data.name.trim().toLowerCase() };
      saveUnits([newUnit, ...units]);
      localStorage.removeItem("unit_form_draft");
      reset();
      updateQueryParams(false); // This will trigger setShowForm(false) via useEffect
      Notify.close();
      Notify.toast("Satuan berhasil ditambahkan", "success");
    }, 500);
  };

  const handleDelete = () => {
    if (!deletingUnit) return;
    Notify.loading("Menghapus satuan...");
    
    setTimeout(() => {
      saveUnits(units.filter(u => u.id !== deletingUnit.id));
      setDeletingUnit(null);
      Notify.close();
      Notify.toast("Satuan berhasil dihapus", "success");
    }, 500);
  };

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Tidak Valid", firstError.message, "error");
    }
  };

  const columns: ColumnDef<UnitData>[] = [
    {
      accessorKey: "name",
      header: "Nama Satuan",
      cell: ({ row }) => (
        <span className="font-bold text-dark dark:text-white uppercase tracking-wider">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="w-full text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex w-full justify-end gap-2">
          <ActionButton
            variant="delete"
            icon={<Icons.Delete size={16} />}
            onClick={() => setDeletingUnit(row.original)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={units}
        pageSize={10}
        title="Manajemen Satuan"
        description="Kelola daftar satuan barang (pcs, liter, dll) untuk inventori"
        searchable={["name"]}
        primaryAction={{
          label: "Tambah Satuan",
          onClick: () => updateQueryParams(true),
        }}
      />

      {showForm && (
        <BaseModal
          title="Tambah Satuan Baru"
          onClose={() => {
            updateQueryParams(false);
            reset();
          }}
          icon={<Icons.Plus size={20} />}
        >
          <form onSubmit={handleSubmit(handleAdd, onInvalid)} className="space-y-4" noValidate>
            <InputGroup
              label="Nama Satuan"
              placeholder="Contoh: rim, pack, roll, dll"
              {...register("name")}
              error={errors.name?.message}
              autoFocus
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-dark-3 mt-4">
              <ActionButton 
                variant="ghost" 
                label="Batal" 
                onClick={() => {
                  updateQueryParams(false);
                  reset();
                }} 
                type="button"
              />
              <ActionButton variant="primary" label="Simpan Satuan" type="submit" />
            </div>
          </form>
        </BaseModal>
      )}

      {deletingUnit && (
        <ConfirmDeleteModal
          title="Hapus Satuan?"
          description={`Anda yakin ingin menghapus satuan "${deletingUnit.name.toUpperCase()}"?`}
          onClose={() => setDeletingUnit(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
