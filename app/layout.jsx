import { Inter, IBM_Plex_Mono } from "next/font/google";
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

export const metadata = {
  title: "Buy Humanoid Robots in Europe & the Middle East | Humanoid Hub",
  description:
    "Sales channel for Chinese humanoid robots in Europe, the Middle East and Africa. EngineAI, Booster Robotics, LimX Dynamics — specs, indicative prices, and quotes within one business day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
