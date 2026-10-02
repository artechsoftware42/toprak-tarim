import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://topraktarim.com.tr"),
  title: {
    default: "Toprak Tarım | Kurumsal Tarım ve Üretim",
    template: "%s | Toprak Tarım",
  },
  icons: {
    icon: [
      { url: "/icon.ico" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}