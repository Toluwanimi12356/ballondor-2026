import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ballon d'Or 2026 — The Community Ballot",
  description: "Eight candidates. Three official criteria. One vote. Enter the independent community journalist ballot.",
  icons: {
    icon: [
      { url: "/brand/ballondor-community-favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/ballondor-community-mark-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/ballondor-community-mark-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = { themeColor: "#070706" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
