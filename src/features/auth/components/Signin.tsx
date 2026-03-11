import SigninWithPassword from "./SigninWithPassword";

export default function Signin() {
  return (
    <>
      <h2 className="mb-2 text-3xl font-bold text-dark dark:text-white">
        Otentikasi Masuk
      </h2>
      <p className="mb-9 text-sm font-medium text-dark-5">
        Akses Panel Kendali AutoService
      </p>

      <div>
        <SigninWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm font-medium text-dark-5">
          Belum punya akses? Hubungi{" "}
          <span className="font-semibold text-dark dark:text-white">Owner</span>{" "}
          atau{" "}
          <span className="font-semibold text-dark dark:text-white">Admin</span>{" "}
          untuk mendapatkan akun.
        </p>
      </div>
    </>
  );
}
