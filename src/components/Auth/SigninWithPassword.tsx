"use client";
import { PasswordIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

const MOCK_USERS = [
  {
    username: "owner",
    password: "owner123",
    role: "Owner",
    name: "Suryo Atmojo",
  },
  { username: "admin", password: "admin123", role: "Admin", name: "Larasati" },
  {
    username: "kasir",
    password: "kasir123",
    role: "Kasir",
    name: "Budi Setiadi",
  },
];

export default function SigninWithPassword() {
  const router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.username === data.username && u.password === data.password,
      );
      if (user) {
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            name: user.name,
            role: user.role,
            username: user.username,
          }),
        );
        router.push(user.role === "Kasir" ? "/bengkel/antrean" : "/");
      } else {
        setError("Username atau password salah.");
      }
      setLoading(false);
    }, 800);
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
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="••••••••"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
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
