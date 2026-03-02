import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold text-dark dark:text-white">
        Otentikasi Masuk
      </h2>
      <p className="mb-9 text-sm font-medium text-dark-5">
        Akses Panel Kendali AutoService
      </p>

      <GoogleSigninButton text="Masuk dengan Google" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center text-xs font-semibold text-dark-5 dark:bg-gray-dark">
          Masuk dengan Email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-dark-5">
          Belum punya akses?{" "}
          <Link href="/auth/sign-up" className="text-dark hover:underline dark:text-white ml-1 font-semibold">
            Minta Akses Admin
          </Link>
        </p>
      </div>
    </>
  );
}
