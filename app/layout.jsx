import { Inter, IBM_Plex_Mono } from "next/font/google";
import { CONFIG } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const SITE_URL = CONFIG.SITE_URL;
const TITLE = "Buy Humanoid Robots in Europe & the Middle East | Humanoid Hub";
const DESCRIPTION =
  "Sales channel for Chinese humanoid robots in Europe, the Middle East and Africa. Ironvale Robotics, Halcyon Robotics, Vantage Dynamics — specs, indicative prices, and quotes within one business day.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // Self-referencing canonical: the Vercel mirror serves identical content, so
  // without this the two deployments compete against each other in search.
  alternates: { canonical: "/" },
  icons: {
    icon: "icon.svg",
    apple: "apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Humanoid Hub",
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Humanoid Hub — EMEA" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
};

export const viewport = {
  themeColor: "#131921",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
