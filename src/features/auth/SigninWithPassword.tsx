"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { authService, normalizeRole } from "@/services/auth.service";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function SigninWithPassword() {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.login(data.username, data.password);
      const role = normalizeRole(result.user.role);

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          name: result.user.name,
          role,
          username: result.user.username,
        }),
      );

      toast.success(`Selamat datang kembali, ${result.user.name}!`);
      router.push(role === "Kasir" ? "/antrean" : "/");
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Username atau password salah.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="Username"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="owner / admin / kasir"
        name="username"
        handleChange={handleChange}
        value={data.username}
        leftIcon={<User className="size-5" />}
      />

      <InputGroup
        type={showPassword ? "text" : "password"}
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="••••••••"
        name="password"
        handleChange={handleChange}
        value={data.password}
        leftIcon={<Lock className="size-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        }
      />

      {error && (
        <p className="bg-danger/10 text-danger mb-4 rounded-lg px-4 py-2.5 text-sm font-bold">
          {error}
        </p>
      )}

      <div className="mb-6 flex items-center justify-between gap-2 py-2">
        <Checkbox
          label="Ingat Sesi Saya"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          className="text-xs font-medium text-dark-5"
          onChange={(e) => setData({ ...data, remember: e.target.checked })}
        />
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-dark p-4 text-sm font-bold text-white transition-none hover:bg-opacity-90 disabled:bg-opacity-50 dark:bg-white dark:text-dark dark:hover:bg-opacity-90"
        >
          {loading ? "Proses Otentikasi..." : "Masuk ke Dashboard"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
