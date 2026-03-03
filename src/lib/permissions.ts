export type Role = "Owner" | "Admin" | "Kasir";

export interface RoutePermission {
  route: string;
  label: string;
}

/** Semua route yang bisa dikontrol aksesnya */
export const PERMISSION_ROUTES: RoutePermission[] = [
  { route: "/", label: "Dashboard" },
  { route: "/bengkel/antrean", label: "Antrean Masuk" },
  { route: "/bengkel/kasir", label: "Kasir & Transaksi" },
  { route: "/bengkel/inventori", label: "Inventori (+ sub-menu)" },
  { route: "/bengkel/pelanggan", label: "Pelanggan" },
  { route: "/bengkel/kendaraan", label: "Kendaraan" },
  { route: "/bengkel/karyawan", label: "Karyawan" },
  { route: "/bengkel/laporan", label: "Laporan" },
  { route: "/bengkel/reminder", label: "Reminder & Follow-up" },
  { route: "/bengkel/pengaturan", label: "Pengaturan" },
];

/** Default permission matrix — dapat di-override oleh Owner */
export const DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  Owner: PERMISSION_ROUTES.map((p) => p.route),
  Admin: [
    "/",
    "/bengkel/antrean",
    "/bengkel/kasir",
    "/bengkel/inventori",
    "/bengkel/pelanggan",
    "/bengkel/kendaraan",
    "/bengkel/karyawan",
    "/bengkel/laporan",
    "/bengkel/reminder",
  ],
  Kasir: ["/bengkel/antrean", "/bengkel/kasir"],
};

/** Halaman tujuan redirect setelah login / akses ditolak, per role */
export const ROLE_HOME: Record<Role, string> = {
  Owner: "/",
  Admin: "/",
  Kasir: "/bengkel/antrean",
};

const STORAGE_KEY = "role_permissions";

/** Route yang selalu bisa diakses oleh semua role yang sudah login */
const ALWAYS_ALLOWED = ["/profile"];

export function getPermissions(): Record<Role, string[]> {
  if (typeof window === "undefined") return DEFAULT_PERMISSIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<Role, string[]>;
      // Owner selalu full access
      parsed.Owner = PERMISSION_ROUTES.map((p) => p.route);
      return parsed;
    }
  } catch {}
  return DEFAULT_PERMISSIONS;
}

export function savePermissions(perms: Record<Role, string[]>) {
  // Owner selalu full access, tidak bisa dikurangi
  perms.Owner = PERMISSION_ROUTES.map((p) => p.route);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perms));
}

/**
 * Cek apakah role tertentu boleh mengakses route.
 * Mendukung prefix-match untuk sub-route (e.g. /bengkel/inventori/stok).
 */
export function canAccess(role: Role, route: string): boolean {
  if (role === "Owner") return true;
  // Halaman yang selalu bisa diakses semua role
  if (ALWAYS_ALLOWED.some((r) => route === r || route.startsWith(r + "/")))
    return true;
  const perms = getPermissions();
  const allowed = perms[role] ?? DEFAULT_PERMISSIONS[role];
  return allowed.some((r) => route === r || route.startsWith(r + "/"));
}
