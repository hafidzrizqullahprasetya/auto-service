"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";

import { useState } from "react";
import { SocialAccounts } from "./_components/social-accounts";
import { Icons } from "@/components/Icons";

export default function Page() {
  const [data, setData] = useState({
    name: "Danish Heilium",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto" ) {
      const file = e.target?.files[0];

      setData({
        ...data,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];

      setData({
        ...data,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[970px] pb-10">
      <Breadcrumb pageName="Profil Sistem" />

      <div className="overflow-hidden rounded-lg border border-stroke bg-white shadow-none dark:border-dark-3 dark:bg-gray-dark">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-dark px-[20px] py-[8px] text-xs font-bold text-white hover:bg-white hover:text-dark border-2 border-dark transition-all dark:bg-white dark:text-dark dark:hover:bg-dark dark:hover:text-white"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />

              <Icons.Edit size={14} />

              <span>Ganti Cover</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />

                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-9 cursor-pointer items-center justify-center rounded-lg bg-dark text-white border-2 border-white hover:bg-white hover:text-dark transition-all dark:bg-white dark:text-dark dark:border-dark dark:hover:bg-dark dark:hover:text-white sm:bottom-2 sm:right-2"
                  >
                    <Icons.Edit size={14} />

                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-2xl font-bold text-dark dark:text-white">
              {data?.name}
            </h3>
            <p className="text-sm font-medium text-dark-5">Senior Mechanic & Operation Manager</p>
            <div className="mx-auto mb-6 mt-6 grid max-w-[450px] grid-cols-3 rounded-lg border border-stroke py-3 shadow-none dark:border-dark-3 dark:bg-gray-dark bg-white">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
                <span className="text-[11px] font-medium text-dark-5">
                  Role
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">Admin</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3">
                <span className="text-[11px] font-medium text-dark-5">
                  Layanan
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">1.2K+</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4">
                <span className="text-[11px] font-medium text-dark-5">
                  Rating
                </span>
                <span className="text-sm font-bold text-dark dark:text-white">4.9/5.0</span>
              </div>
            </div>

            <div className="mx-auto max-w-[720px] border-t border-stroke pt-6 dark:border-dark-3">
              <h4 className="text-sm font-bold text-dark dark:text-white">
                Biografi Singkat
              </h4>
              <p className="mt-4 text-sm font-medium text-dark-5 leading-relaxed">
                Berpengalaman lebih dari 8 tahun dalam menangani berbagai macam kendala mesin mobil dan motor.
                Fokus pada efisiensi kerja dan kepuasan pelanggan di AutoService Premium Garage.
                Bertanggung jawab penuh atas manajemen antrean dan inventori stok harian.
              </p>
            </div>

            <SocialAccounts />
          </div>
        </div>
      </div>
    </div>
  );
}
