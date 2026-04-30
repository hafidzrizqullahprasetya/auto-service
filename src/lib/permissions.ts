export type Role = "Owner" | "Admin" | "Kasir";

export interface RoutePermission {
  route: string;
  label: string;
}

export const PERMISSION_ROUTES: RoutePermission[] = [
  { route: "/", label: "Dashboard" },
  { route: "/antrean", label: "Antrean Masuk" },
  { route: "/kasir", label: "Kasir & Transaksi" },
  { route: "/inventori", label: "Inventori (+ sub-menu)" },
  { route: "/pelanggan", label: "Pelanggan" },
  { route: "/kendaraan", label: "Kendaraan" },
  { route: "/karyawan", label: "Karyawan" },
  { route: "/katalog-jasa", label: "Katalog Jasa & Paket" },
  { route: "/laporan", label: "Laporan" },
  { route: "/reminder", label: "Reminder & Follow-up" },
  { route: "/pengaturan", label: "Pengaturan" },
];

export const DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  Owner: PERMISSION_ROUTES.map((p) => p.route),
  Admin: [
    "/",
    "/antrean",
    "/kasir",
    "/inventori",
    "/pelanggan",
    "/kendaraan",
    "/karyawan",
    "/katalog-jasa",
    "/laporan",
    "/reminder",
  ],
  Kasir: ["/antrean", "/kasir"],
};

export const ROLE_HOME: Record<Role, string> = {
  Owner: "/",
  Admin: "/",
  Kasir: "/antrean",
};

const STORAGE_KEY = "role_permissions";
const ALWAYS_ALLOWED = ["/profile"];

export function getPermissions(): Record<Role, string[]> {
  if (typeof window === "undefined") return DEFAULT_PERMISSIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<Role, string[]>;
      parsed.Owner = PERMISSION_ROUTES.map((p) => p.route);
      return parsed;
    }
  } catch {}
  return DEFAULT_PERMISSIONS;
}

export function savePermissions(perms: Record<Role, string[]>) {
  perms.Owner = PERMISSION_ROUTES.map((p) => p.route);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perms));
}

export function canAccess(role: Role, route: string): boolean {
  if (role === "Owner") return true;
  if (ALWAYS_ALLOWED.some((r) => route === r || route.startsWith(r + "/")))
    return true;
  const perms = getPermissions();
  const allowed = perms[role] ?? DEFAULT_PERMISSIONS[role];
  return allowed.some((r) => route === r || route.startsWith(r + "/"));
}
