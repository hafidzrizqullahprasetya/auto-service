const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://be-opname.vercel.app";

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? "/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

export interface ApiEnvelopeRaw<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: { page: number; total: number; per_page: number };
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  skipAuthRedirect = false,
): Promise<ApiEnvelopeRaw<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

const url = `${API_BASE.replace(/\/+$/, "")}${path}`;
  if (process.env.NODE_ENV === "development") {
    console.log(`[API REQUEST] ${options.method || "GET"} ${url}`);
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && !skipAuthRedirect) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_refresh_token");
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      sessionStorage.removeItem("auth_refresh_token");
      window.location.href = "/auth/sign-in";
    }
    throw new Error("Sesi habis, silakan login ulang.");
  }

  let json: ApiEnvelopeRaw<T>;
  const text = await res.text();

  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error("FAILED TO PARSE JSON FROM API:", {
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      body: text,
    });
    throw new Error(
      `Format respon server tidak valid (bukan JSON). Status: ${res.status}. Lihat konsol untuk detail.`,
    );
  }

  if (!res.ok) {
    throw new Error(json.message ?? `HTTP ${res.status}`);
  }

  return json;
}

function apiPath(path: string): string {
  // Normalize path: remove any leading /api/v1 or /v1 prefix if present
  const baseCleanPath = path.replace(/^\/?(api\/v1|v1)\//, "/").replace(/^\/?(api\/v1|v1)$/, "/");
  
  // Ensure we have a single leading slash
  const cleanPath = baseCleanPath.startsWith("/") ? baseCleanPath : `/${baseCleanPath}`;
  
  // Normalize API_VERSION prepending
  const version = API_VERSION.replace(/\/+$/, "");
  const versionClean = version.startsWith("/") ? version : `/${version}`;
  
  // Combine version and path, ensuring no double slashes
  if (cleanPath === "/") return versionClean;
  return `${versionClean}${cleanPath}`;
}

export const api = {
  get: <T>(path: string) => request<T>(apiPath(path)),
  post: <T>(path: string, body?: unknown, skipAuthRedirect = false) =>
    request<T>(apiPath(path), {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }, skipAuthRedirect),
  put: <T>(path: string, body?: unknown) =>
    request<T>(apiPath(path), {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(apiPath(path), {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(apiPath(path), { method: "DELETE" }),
};
