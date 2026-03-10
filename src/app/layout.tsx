import "@/css/satoshi.css";
import "@/css/style.css";

import { Sidebar } from "@/components/layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | AutoService",
    default: "AutoService - Premium Garage",
  },
  description:
    "Sistem manajemen bengkel mobil dan motor profesional.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#000000" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
