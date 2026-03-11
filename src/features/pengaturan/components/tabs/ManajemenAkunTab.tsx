import { useState } from "react";
import { Icons } from "@/components/Icons";
import { useEmployees } from "@/hooks/useEmployees";
import { Badge } from "@/features/shared";
import { Notify } from "@/utils/notify";
import { EmployeeFormModal } from "@/features/karyawan";
import { usersService } from "@/services/users.service";
import {
  PERMISSION_ROUTES,
  DEFAULT_PERMISSIONS,
  getPermissions,
  savePermissions,
  type Role,
} from "@/lib/permissions";
import { SectionCard } from "./SectionCard";
import { ManajemenAkunTabSkeleton } from "./ManajemenAkunTabSkeleton";

function PermissionEditor() {
  const [perms, setPerms] = useState(() => getPermissions());
  const [saved, setSaved] = useState(false);
  const [isSavingPerms, setIsSavingPerms] = useState(false);

  const toggle = (role: "Admin" | "Kasir", route: string) => {
    setPerms((prev) => {
      const current = prev[role] ?? [...DEFAULT_PERMISSIONS[role]];
      const next = current.includes(route)
        ? current.filter((r) => r !== route)
        : [...current, route];
      return { ...prev, [role]: next };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSavingPerms(true);
    savePermissions(perms);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsSavingPerms(false);
      Notify.toast("Hak akses diperbarui");
    }, 1000);
  };

  return (
    <SectionCard title="Pengaturan Izin Akses">
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 p-4 transition-all dark:border-warning/10">
        <Icons.Alert size={18} className="mt-0.5 shrink-0 text-warning" />
        <p className="text-xs leading-relaxed text-dark-5 dark:text-dark-6">
          Berikut adalah pengaturan hak akses per halaman untuk setiap role.{" "}
          <strong className="text-dark dark:text-white">Owner</strong> memiliki otoritas penuh dan tidak dapat dibatasi.
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        <div className="min-w-[400px] overflow-hidden rounded-xl border border-stroke dark:border-dark-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 border-b border-stroke dark:bg-dark-2 dark:border-dark-3">
                <th className="px-3 py-3 text-left text-[9px] font-black uppercase tracking-wider text-dark-5 md:px-4 md:text-[10px]">
                  Modul / Halaman
                </th>
                <th className="px-3 py-3 text-center text-[9px] font-black uppercase tracking-wider text-blue-600 md:px-4 md:text-[10px]">
                  Admin
                </th>
                <th className="px-3 py-3 text-center text-[9px] font-black uppercase tracking-wider text-amber-600 md:px-4 md:text-[10px]">
                  Kasir
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke dark:divide-dark-3">
            {PERMISSION_ROUTES.filter((p) => p.route !== "/").map((p) => (
              <tr
                key={p.route}
                className="group hover:bg-gray-50 dark:hover:bg-dark-3/50 transition-colors"
              >
                <td className="px-4 py-3.5">
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-dark dark:text-white">{p.label}</span>
                      <span className="text-[9px] text-dark-5 font-medium">{p.route}</span>
                   </div>
                </td>
                <td className="px-4 py-3.5 text-center">
                   <label className="inline-flex cursor-pointer items-center justify-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={(perms.Admin ?? DEFAULT_PERMISSIONS.Admin).includes(p.route)}
                      onChange={() => toggle("Admin", p.route)}
                      className="size-4 cursor-pointer accent-dark dark:accent-white"
                    />
                  </label>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <label className="inline-flex cursor-pointer items-center justify-center p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                    <input
                      type="checkbox"
                      checked={(perms.Kasir ?? DEFAULT_PERMISSIONS.Kasir).includes(p.route)}
                      onChange={() => toggle("Kasir", p.route)}
                      className="size-4 cursor-pointer accent-dark dark:accent-white"
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSavingPerms}
          className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-dark px-8 py-3 text-sm font-bold text-white transition-all hover:bg-opacity-90 disabled:opacity-50 dark:bg-white dark:text-dark"
        >
          {isSavingPerms ? (
            <Icons.RefreshCcw size={16} className="animate-spin" />
          ) : (
            <Icons.Success size={18} />
          )}
          <span>{isSavingPerms ? "Menyimpan..." : "Simpan Hak Akses"}</span>
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-bold text-success animate-in fade-in slide-in-from-left-2">
            <Icons.Success size={16} /> Tersimpan
          </span>
        )}
      </div>
    </SectionCard>
  );
}

export function ManajemenAkunTab({ userRole }: { userRole: Role }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const { data: employees, loading, refetch } = useEmployees();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data: any) => {
    try {
      setSaving(true);
      if (selectedEmp) {
        await usersService.update(selectedEmp.id, data);
        Notify.toast("Akun berhasil diperbarui");
      } else {
        await usersService.create(data);
        Notify.toast("Akun baru berhasil dibuat");
      }
      setShowModal(false);
      setSelectedEmp(null);
      refetch();
    } catch (err) {
      Notify.alert("Gagal", "Gagal menyimpan akun", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Notify.confirm("Hapus Akun", "Apakah Anda yakin ingin menghapus akun ini?");
    if (confirm) {
      try {
        await usersService.delete(id);
        Notify.toast("Akun berhasil dihapus");
        refetch();
      } catch (err) {
        Notify.alert("Gagal", "Gagal menghapus akun", "error");
      }
    }
  };

  if (loading) return <ManajemenAkunTabSkeleton />;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 rounded-xl border border-stroke bg-gray-1 p-4 dark:border-dark-3 dark:bg-dark-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dark/5 dark:bg-white/5">
          <Icons.Lock size={18} className="text-dark-5 dark:text-dark-6" />
        </div>
        <p className="text-xs leading-relaxed font-medium text-dark-5 line-clamp-2">
           Informasi Akun: Manajemen kredensial bersifat sensitif. Akses manipulasi data hanya tersedia untuk level <strong className="text-dark dark:text-white">Owner</strong> dan <strong className="text-dark dark:text-white">Admin</strong>.
        </p>
      </div>

      <SectionCard
        title="Daftar Akun Pengguna"
        rightElement={
          <button
            onClick={() => {
              setSelectedEmp(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-dark px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-opacity-90 dark:bg-white dark:text-dark"
          >
            <Icons.Plus size={16} />
            Tambah Akun
          </button>
        }
      >
        {showModal && (
          <EmployeeFormModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            initialData={selectedEmp}
            mode={selectedEmp ? "edit" : "create"}
            isLoading={saving}
          />
        )}

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-1">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="group flex flex-col gap-3 rounded-xl border border-stroke bg-white p-4 transition-all hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:hover:bg-dark-3/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-2 text-dark-5 dark:bg-dark-3">
                  <Icons.Karyawan size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-dark dark:text-white">
                    {emp.name}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="text-[11px] font-bold text-secondary">@{emp.username}</p>
                    <span className="h-1 w-1 rounded-full bg-stroke dark:bg-dark-4"></span>
                    <p className="text-[11px] font-medium text-dark-5">{emp.phone || "No Phone"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-stroke pt-3 sm:border-0 sm:pt-0 sm:justify-end gap-4">
                <Badge
                  variant={
                    emp.role === "Owner"
                      ? "neutral"
                      : emp.role === "Admin"
                        ? "info"
                        : "warning"
                  }
                  className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm"
                >
                  {emp.role}
                </Badge>
                
                {emp.role !== "Owner" && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedEmp(emp);
                        setShowModal(true);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke text-dark-5 transition-all hover:border-dark hover:text-dark dark:border-dark-4 dark:hover:border-white dark:hover:text-white"
                      title="Edit Akun"
                    >
                      <Icons.Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(emp.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-stroke text-danger transition-all hover:border-danger hover:bg-danger/5 dark:border-dark-4"
                      title="Hapus Akun"
                    >
                      <Icons.Delete size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {userRole === "Owner" && <PermissionEditor />}
    </div>
  );
}
