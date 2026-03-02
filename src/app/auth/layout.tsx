import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-1 dark:bg-dark">
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        {children}
      </div>
    </div>
  );
}
