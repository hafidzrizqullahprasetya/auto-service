"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Checkbox } from "@/components/ui/checkbox";
import { authService, normalizeRole } from "@/services/auth.service";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { Notify } from "@/utils/notify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signinSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong!"),
  password: z.string().min(1, "Password tidak boleh kosong!"),
  remember: z.boolean(),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export default function SigninWithPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = async (data: SigninFormValues) => {
    Notify.loading("Memverifikasi kredensial...");
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const result = await authService.login(data.username, data.password);
      const role = normalizeRole(result.user.role);

      const userObject = {
        name: result.user.name,
        role,
        username: result.user.username,
      };

      if (data.remember) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("auth_refresh_token", result.refresh_token || ""); 
        localStorage.setItem("auth_user", JSON.stringify(userObject));
      } else {
        sessionStorage.setItem("auth_token", result.token);
        sessionStorage.setItem("auth_refresh_token", result.refresh_token || ""); 
        sessionStorage.setItem("auth_user", JSON.stringify(userObject));
      }

      const destination = role === "Kasir" ? "/antrean" : "/";
      sessionStorage.setItem("welcome_toast", `Selamat datang kembali, ${result.user.name}!`);
      router.push(destination);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Username atau password salah.";
        
      setError("username", { type: "server", message: " " }); 
      setError("password", { type: "server", message: "Kredensial tidak cocok" });
        
      Notify.alert("Gagal Masuk!", errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup
        type="text"
        label="Username"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="owner / admin / kasir"
        leftIcon={<User className="size-5" />}
        {...register("username")} 
        error={errors.username?.message} 
      />

      <InputGroup
        type={showPassword ? "text" : "password"}
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="••••••••"
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
        {...register("password")}
        error={errors.password?.message}
      />

      <div className="mb-6 flex items-center justify-between gap-2 py-2">
        <Checkbox
          label="Ingat Sesi Saya"
          withIcon="check"
          minimal
          radius="md"
          className="text-xs font-medium text-dark-5"
          {...register("remember")}
        />
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-dark p-4 text-sm font-bold text-white transition-none hover:bg-opacity-90 disabled:bg-opacity-50 dark:bg-white dark:text-dark dark:hover:bg-opacity-90"
        >
          {isSubmitting ? "Proses Otentikasi..." : "Masuk ke Dashboard"}
          {isSubmitting && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-dark dark:border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}
