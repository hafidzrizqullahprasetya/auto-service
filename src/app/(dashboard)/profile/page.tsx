"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/hooks/useAuth";
import { authService, normalizeRole } from "@/services/auth.service";
import { Notify } from "@/utils/notify";
import { ActionButton } from "@/features/shared";

const ROLE_AVATARS: Record<string, string> = {
  owner: "/images/user/user-03.png",
  admin: "/images/user/user-03.png",
  kasir: "/images/user/user-03.png",
};

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    if (stored) {
      try {
        const user = JSON.parse(stored) as AuthUser;
        setAuthUser(user);
        setPhone(user.phone || "");
      } catch {}
    }
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      Notify.loading("Menyimpan profil...");
      
      const payload: any = {};
      if (phone !== authUser?.phone) payload.phone = phone;
      if (password) payload.password = password;
      
      const res = await authService.updateProfile(payload);
      
      // Update local storage
      const updatedUser = { 
        ...authUser, 
        ...res.user,
        role: res.user.role ? normalizeRole(res.user.role) : authUser?.role 
      } as AuthUser;
      
      if (localStorage.getItem("auth_user")) {
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      } else if (sessionStorage.getItem("auth_user")) {
        sessionStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
      
      setAuthUser(updatedUser);
      setPassword(""); // Clear password field after save
      setIsEditing(false);
      Notify.toast("Profil berhasil diperbarui!", "success", "top-end");
      
      // Refresh the page to reflect changes globally if needed
      router.refresh();
    } catch (error: any) {
      Notify.alert("Gagal", error.message || "Gagal memperbarui profil", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = authUser?.name ?? "Pengguna";
  const displayRole = authUser?.role ?? "-";
  const displayUsername = authUser?.username ?? "-";
  const displayPhone = authUser?.phone ?? "Belum ada nomor HP";
  const displayImg = authUser
    ? (ROLE_AVATARS[authUser.username] ?? "/images/user/user-03.png")
    : "/images/user/user-03.png";

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-stroke px-6 py-4 dark:border-dark-3 flex justify-between items-center">
          <h3 className="font-medium text-dark dark:text-white">
            Profil Saya
          </h3>
          {!isEditing ? (
            <ActionButton
              variant="primary"
              size="md"
              label="Edit Profil"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <div className="flex gap-2">
              <ActionButton
                variant="outline"
                size="md"
                label="Batal"
                onClick={() => {
                  setIsEditing(false);
                  setPhone(authUser?.phone || "");
                  setPassword("");
                }}
                disabled={isSaving}
              />
              <ActionButton
                variant="primary"
                size="md"
                label={isSaving ? "Menyimpan..." : "Simpan"}
                loading={isSaving}
                onClick={handleSave}
              />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-1 dark:border-dark-3">
              <Image
                src={displayImg}
                alt="Profile"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="flex-grow w-full">
              <div className="mb-4 text-center sm:text-left">
                <h4 className="text-2xl font-bold text-dark dark:text-white">
                  {displayName}
                </h4>
                <p className="text-sm font-medium text-gray-5 dark:text-gray-4 capitalize">
                  {displayRole}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
                  <p className="mb-1 text-sm font-medium text-gray-5 dark:text-gray-4">
                    Username
                  </p>
                  <p className="font-medium text-dark dark:text-white">
                    {displayUsername}
                  </p>
                </div>
                
                <div className="rounded-lg border border-stroke p-4 dark:border-dark-3">
                  <p className="mb-1 text-sm font-medium text-gray-5 dark:text-gray-4">
                    Nomor HP
                  </p>
                  {!isEditing ? (
                    <p className="font-medium text-dark dark:text-white">
                      {displayPhone}
                    </p>
                  ) : (
                    <input
                      type="text"
                      className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-dark-3"
                      placeholder="Masukkan Nomor HP"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  )}
                </div>
                
                {isEditing && (
                  <div className="rounded-lg border border-stroke p-4 dark:border-dark-3 sm:col-span-2">
                    <p className="mb-1 text-sm font-medium text-gray-5 dark:text-gray-4">
                      Password Baru (Kosongkan jika tidak ingin mengubah)
                    </p>
                    <input
                      type="password"
                      className="w-full rounded-md border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary dark:border-dark-3"
                      placeholder="Masukkan Password Baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
