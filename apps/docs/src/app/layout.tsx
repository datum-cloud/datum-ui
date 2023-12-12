import "./globals.css";
import "@repo/ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Datum UI Docs | Datum | Start here, go anywhere",
  description: "Datum's susUI documentation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className="bg-blue-600" lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
