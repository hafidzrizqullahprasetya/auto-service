"use client";

import { useEffect, useState } from "react";
import type { Role } from "@/lib/permissions";

export interface AuthUser {
  name: string;
  role: Role;
  username: string;
}

export function useAuth(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {}
    }
  }, []);

  return user;
}
