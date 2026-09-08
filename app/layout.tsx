import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Ultimate Alumni Travel Club — Group Travel for Alumni",
  description:
    "Alumni group travel, football weekends, and reunion trips — with your people, in your colors. Members save on every trip. Join the Ultimate Alumni Travel Club.",
  keywords: [
    "alumni travel",
    "alumni trips",
    "college football travel",
    "tailgate packages",
    "reunion trips",
    "group travel",
  ],
  openGraph: {
    title: "Ultimate Alumni Travel Club",
    description:
      "Group travel for alumni — football weekends, reunions, and adventures in your college colors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}