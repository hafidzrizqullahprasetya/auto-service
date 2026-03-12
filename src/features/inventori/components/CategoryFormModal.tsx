"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ActionButton, BaseModal } from "@/features/shared";
import { Icons } from "@/components/Icons";
import InputGroup from "@/components/ui/InputGroup";
import { Notify } from "@/utils/notify";
import { useState, useEffect } from "react";

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori tidak boleh kosong").max(50, "Nama kategori terlalu panjang"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  initialData?: { id: number; name: string } | null;
  isLoading?: boolean;
}

export function CategoryFormModal({
  onClose,
  onSave,
  initialData,
  isLoading: externalLoading = false,
}: CategoryFormModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = externalLoading || internalLoading;
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  const nameValue = watch("name");

  // Effect to load draft and save changes
  useEffect(() => {
    if (!isEdit) {
      const draft = localStorage.getItem("category_form_draft");
      if (draft) setValue("name", draft);
    }
  }, [isEdit, setValue]);

  useEffect(() => {
    if (!isEdit) {
      localStorage.setItem("category_form_draft", nameValue);
    }
  }, [nameValue, isEdit]);

  const onFormSubmit: SubmitHandler<CategoryFormValues> = async (data) => {
    try {
      setInternalLoading(true);
      Notify.loading(isEdit ? "Memperbarui kategori..." : "Menambah kategori...");
      await onSave(data.name);
      Notify.close();
      if (!isEdit) localStorage.removeItem("category_form_draft");
      onClose();
    } catch (err) {
      Notify.close();
      // Error usually handled by onSave via Notify.alert/toast
    } finally {
      setInternalLoading(false);
    }
  };

  const onInvalid = (errs: any) => {
    const firstError = Object.values(errs)[0] as any;
    if (firstError?.message) {
      Notify.alert("Form Belum Lengkap", firstError.message, "error");
    }
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Kategori" : "Tambah Kategori Baru"}
      description={isEdit ? "Ubah nama kategori inventori" : "Masukkan nama kategori baru untuk mengelompokkan item"}
      icon={<Icons.Inventory size={20} />}
      onClose={onClose}
      maxWidth="sm"
      hideFooter
    >
      <form 
        onSubmit={handleSubmit(onFormSubmit, onInvalid)} 
        className="space-y-4"
        noValidate
      >
        <InputGroup
          label="Nama Kategori"
          placeholder="Contoh: Oli Mesin, Ban Luar, Rem"
          {...register("name")}
          error={errors.name?.message}
          autoFocus
        />

        <div className="flex justify-end gap-3 pt-4">
          <ActionButton
            variant="ghost"
            label="Batal"
            onClick={onClose}
            disabled={loading}
            type="button"
          />
          <ActionButton
            variant="primary"
            label={loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Kategori"}
            disabled={loading}
            type="submit"
          />
        </div>
      </form>
    </BaseModal>
  );
}
