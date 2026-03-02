import Signin from "@/components/Auth/Signin";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignIn() {
  return (
    <>
      <div className="rounded-lg border border-stroke bg-white shadow-none dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex flex-wrap items-center">
          <div className="w-full xl:w-1/2">
            <div className="w-full p-4 sm:p-12.5 xl:p-15">
              <Signin />
            </div>
          </div>

          <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
            <div className="relative overflow-hidden rounded-lg bg-dark px-12.5 pt-12.5 dark:bg-dark-2 border-2 border-dark dark:border-white h-full min-h-[600px] flex flex-col items-center justify-center text-center">
              <Link className="mb-10 inline-block" href="/">
                <Image
                  className="hidden dark:block"
                  src={"/images/logo/logo.svg"}
                  alt="Logo"
                  width={200}
                  height={40}
                />
                <Image
                  className="dark:hidden inverse brightness-0 invert"
                  src={"/images/logo/logo-dark.svg"}
                  alt="Logo"
                  width={200}
                  height={40}
                />
              </Link>
              <div className="relative z-10">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                  SISTEM OTENTIKASI
                </p>

                <h1 className="mb-4 text-3xl font-black uppercase tracking-tighter text-white sm:text-heading-3">
                  AUTOSERVICE <span className="text-gray-500">PRO</span>
                </h1>

                <p className="mx-auto w-full max-w-[300px] text-sm font-bold uppercase leading-relaxed tracking-tight text-gray-400">
                  MANAJEMEN INVENTORI, STOK OPNAME & REAL-TIME QUEUE SYSTEM.
                </p>
              </div>

              <div className="mt-20 opacity-20 grayscale">
                <Image
                  src={"/images/grids/grid-02.svg"}
                  alt="Logo"
                  width={405}
                  height={325}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
