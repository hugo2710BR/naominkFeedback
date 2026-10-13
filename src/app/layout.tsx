import type { Metadata, Viewport } from "next";
import { Fraunces, Jost } from "next/font/google";
import { SITE, SITE_TITLE } from "@/config/site";
import "@/styles/tokens.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: SITE_TITLE,
  description: SITE.description,
  openGraph: {
    title: SITE_TITLE,
    description: SITE.description,
    images: [SITE.heroImage],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE.description,
    images: [SITE.heroImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0c0b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${fraunces.variable} ${jost.variable}`}>
      <body className="bg-nmk-bg font-ui text-nmk-text">{children}</body>
    </html>
  );
}
