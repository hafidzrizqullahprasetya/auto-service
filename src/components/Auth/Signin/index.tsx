import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <h2 className="mb-2 text-3xl font-black uppercase tracking-tighter text-dark dark:text-white">
        OTENTIKASI MASUK
      </h2>
      <p className="mb-9 text-sm font-bold uppercase tracking-widest text-dark-5">
        Akses Panel Kendali AutoService
      </p>

      <GoogleSigninButton text="MASUK DENGAN GOOGLE" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center text-[10px] font-black uppercase tracking-[0.2em] dark:bg-gray-dark text-dark-5">
          METODE EMAIL
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-dark-5">
          Belum punya akses?{" "}
          <Link href="/auth/sign-up" className="text-dark hover:underline dark:text-white ml-1">
            MINTA AKSES ADMIN
          </Link>
        </p>
      </div>
    </>
  );
}
