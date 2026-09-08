import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Ultimate Alumni Travel Club — Premium Group Travel for Alumni",
  description: "Curated group travel experiences for university alumni. Handpicked destinations, expert-led adventures, and exclusive member benefits. Your next journey starts here.",
  keywords: ["alumni travel", "group travel", "university alumni", "travel club", "luxury travel", "curated adventures"],
  openGraph: {
    title: "Ultimate Alumni Travel Club",
    description: "Curated group travel experiences for university alumni.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}