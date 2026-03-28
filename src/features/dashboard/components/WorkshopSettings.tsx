"use client";

import { useState, useEffect } from "react";
import { Icons } from "@/components/Icons";
import { useSettings } from "@/hooks/useSettings";
import { WorkshopSettingsSkeleton } from "./WorkshopSettingsSkeleton";

export function WorkshopSettings() {
  const { data: settings, loading } = useSettings();

  if (loading) return <WorkshopSettingsSkeleton />;

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-bold text-dark dark:text-white">
          Informasi Bengkel
        </h3>
      </div>
      <div className="p-7">
        <form action="#">
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Nama Bengkel
              </label>
              <div className="relative">
                <span className="absolute left-4.5 top-1/2 -translate-y-1/2">
                  <Icons.Dashboard size={18} />
                </span>
                <input
                  className="w-full rounded-md border border-stroke bg-gray-2 py-3 pl-11.5 pr-4.5 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                  type="text"
                  defaultValue={settings?.name || "AutoService Premium Garage"}
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Nomor Telepon / WA
              </label>
              <input
                className="w-full rounded-md border border-stroke bg-gray-2 px-4.5 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                type="text"
                defaultValue={settings?.phone || "+62 812-3456-7890"}
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
              Alamat Lengkap
            </label>
            <div className="relative">
              <textarea
                className="w-full rounded-md border border-stroke bg-gray-2 px-4.5 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                name="bio"
                id="bio"
                rows={4}
                defaultValue={settings?.address || "Jl. Otomotif No. 123, Kawasan Industri Otomotif, Jakarta Selatan, Indonesia."}
              ></textarea>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Tarif PPN (%)
              </label>
              <input
                className="w-full rounded-md border border-stroke bg-gray-2 px-4.5 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                type="number"
                defaultValue={settings?.tax_percentage || "11"}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <label className="mb-3 block text-sm font-medium text-dark dark:text-white">
                Mata Uang
              </label>
              <select className="w-full rounded-md border border-stroke bg-gray-2 px-4.5 py-3 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                <option value="IDR">IDR (Rp)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              className="flex justify-center rounded-md border border-stroke px-6 py-2 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex justify-center rounded-md bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 shadow-sm transition-all active:scale-95"
              type="submit"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
