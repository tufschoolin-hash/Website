import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/cn";
import {
  IS_SITE_URL_CONFIGURED,
  SITE_ALTERNATE_NAME,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_ALT,
  SITE_SHORT_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

import "./globals.css";

const displayFont = localFont({
  src: "../fonts/space-grotesk-var.woff2",
  variable: "--font-grotesk",
  display: "swap",
  weight: "300 700",
  style: "normal",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const editorialFont = localFont({
  src: "../fonts/pt-serif-italic.woff2",
  variable: "--font-serif-italic",
  display: "swap",
  weight: "400",
  style: "italic",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

if (process.env.NODE_ENV === "production" && !IS_SITE_URL_CONFIGURED) {
  console.warn(
    "[tuf-networks] NEXT_PUBLIC_SITE_URL is not set. Canonical URLs, Open Graph URLs and the sitemap will use http://localhost:3000. Set it before deploying.",
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_ALTERNATE_NAME,
  category: "Business",
  keywords: [
    "TUF Networks",
    "The Ultimate Foundery",
    "founder network Kerala",
    "curated network",
    "founders",
    "builders",
    "creators",
    "operators",
    "Kerala",
    "India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_SHORT_DESCRIPTION,
    url: "/",
    locale: "en_IN",
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_OG_IMAGE_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_SHORT_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon-32.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    title: SITE_NAME,
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04100b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={cn(displayFont.variable, editorialFont.variable)}>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <noscript>
          <style>{`
            #site-nav {
              position: static !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: stretch !important;
              width: 100% !important;
              order: 3;
              padding: 1rem 0 0 !important;
              border: 0 !important;
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
              transform: none !important;
              background: transparent !important;
              box-shadow: none !important;
            }
            #site-nav ul { flex-direction: column !important; align-items: stretch !important; }
            #site-nav a { border-bottom: 1px solid var(--line); }
            header > div { flex-wrap: wrap; }
            button[aria-controls="site-nav"] { display: none !important; }
            [data-marquee-track] { animation: none !important; transform: none !important; }
            [data-marquee-control] { display: none !important; }
          `}</style>
        </noscript>
      </body>
    </html>
  );
}
