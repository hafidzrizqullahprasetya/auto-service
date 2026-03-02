import type { PropsWithChildren } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SISTEM PROFIL | AutoService",
};

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
