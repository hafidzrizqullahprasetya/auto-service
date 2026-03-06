import Signin from "@/features/auth/Signin";
import type { Metadata } from "next";

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
            <div className="relative overflow-hidden rounded-lg bg-dark p-12.5 dark:bg-dark-2 border-2 border-dark dark:border-white h-full min-h-[600px] flex flex-col items-center justify-center text-center">
              <div className="relative z-10">
                <h1 className="mb-4 text-3xl font-bold text-white sm:text-heading-3">
                  AutoService 
                </h1>

                <p className="mx-auto w-full max-w-[300px] text-sm font-medium leading-relaxed text-gray-400">
                  Manajemen Inventori, Stok Opname & Real-Time Queue System.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
