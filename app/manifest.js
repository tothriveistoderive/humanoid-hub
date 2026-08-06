export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function manifest() {
  return {
    name: "Humanoid Hub — Buy Humanoid Robots in EMEA",
    short_name: "Humanoid Hub",
    description:
      "Independent EMEA sales channel for humanoid robot platforms — published specs, visible prices, formal quotes within one business day.",
    start_url: `${BASE}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#131921",
    icons: [
      { src: `${BASE}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
