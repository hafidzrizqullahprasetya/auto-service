const API_BASE =
  process.env.NEXT_PUBLIC_API_URL;

const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;

// Track if we're already refreshing to avoid race conditions (multiple requests expiring at once)
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_refresh_token") || sessionStorage.getItem("auth_refresh_token");
}

function saveNewToken(token: string) {
  // Save to whichever storage currently has the session
  if (localStorage.getItem("auth_refresh_token")) {
    localStorage.setItem("auth_token", token);
  } else {
    sessionStorage.setItem("auth_token", token);
  }
}

function forceLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  localStorage.removeItem("auth_refresh_token");
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_user");
  sessionStorage.removeItem("auth_refresh_token");
  window.location.href = "/auth/sign-in";
}

async function tryRefreshToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const url = `${API_BASE.replace(/\/+$/, "")}/api/v1/auth/refresh`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    const newToken = json?.data?.token;
    if (newToken) {
      saveNewToken(newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
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

  // --- Auto Token Refresh (like Instagram/Facebook) ---
  if (res.status === 401 && !skipAuthRedirect) {
    // If another request is already refreshing, wait for it to complete
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push(async (newToken: string) => {
          try {
            const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
            const retryRes = await fetch(url, { ...options, headers: retryHeaders });
            const text = await retryRes.text();
            const json = JSON.parse(text);
            if (retryRes.ok) resolve(json);
            else reject(new Error(json.message ?? `HTTP ${retryRes.status}`));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    isRefreshing = true;
    const newToken = await tryRefreshToken();
    isRefreshing = false;

    if (newToken) {
      // Notify all queued requests waiting for the refresh
      onRefreshed(newToken);
      // Retry the original request with the new token
      const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
      const retryRes = await fetch(url, { ...options, headers: retryHeaders });
      const text = await retryRes.text();
      let json: ApiEnvelopeRaw<T>;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Format respon server tidak valid. Status: ${retryRes.status}`);
      }
      if (!retryRes.ok) throw new Error(json.message ?? `HTTP ${retryRes.status}`);
      return json;
    }

    // Refresh token also failed/expired → force logout
    forceLogout();
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
  const baseCleanPath = path.replace(/^\/(api\/v1|v1)\//, "/").replace(/^\/(api\/v1|v1)$/, "/");
  const cleanPath = baseCleanPath.startsWith("/") ? baseCleanPath : `/${baseCleanPath}`;
  const version = API_VERSION.replace(/\/+$/, "");
  const versionClean = version.startsWith("/") ? version : `/${version}`;
  if (cleanPath === "/") return versionClean;
  return `${versionClean}${cleanPath}`;
}

export const api = {
  get: <T>(path: string) => request<T>(apiPath(path)),
  post: <T>(path: string, body?: unknown, skipAuthRedirect = false) =>
    request<T>(
      apiPath(path),
      {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      },
      skipAuthRedirect,
    ),
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
