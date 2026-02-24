import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import SigninWithPassword from "../SigninWithPassword";

export default function Signin() {
  return (
    <>
      <h2 className="mb-3 text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        Masuk
      </h2>
      <p className="mb-9 font-medium text-dark-4 dark:text-dark-6">
        Gunakan akun terdaftar Anda untuk melanjutkan
      </p>

      <GoogleSigninButton text="Masuk dengan Google" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark text-dark-5">
          Atau dengan email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p className="text-dark-4 dark:text-dark-6">
          Belum punya akun?{" "}
          <Link href="/auth/sign-up" className="text-primary font-bold hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </>
  );
}
