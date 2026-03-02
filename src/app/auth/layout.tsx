import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-1 p-4 dark:bg-dark md:p-6 2xl:p-10">
      <div className="w-full max-w-screen-xl">
        {children}
      </div>
    </div>
  );
}
