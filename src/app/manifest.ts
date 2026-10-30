import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TUF Networks",
    short_name: "TUF Networks",
    description:
      "A curated network of founders, builders, creators and operators in Kerala, India.",
    start_url: "/",
    display: "standalone",
    background_color: "#04100b",
    theme_color: "#04100b",
    lang: "en-IN",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
