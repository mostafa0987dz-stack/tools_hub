import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToolsHub - أدوات هب",
    short_name: "ToolsHub",
    description: "Fast, free online tools · أدوات سريعة ومجانية",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b1f24",
    theme_color: "#14b8a6",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
