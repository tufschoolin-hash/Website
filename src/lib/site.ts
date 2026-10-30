export const SITE_NAME = "TUF Networks";
export const SITE_ALTERNATE_NAME = "The Ultimate Foundery";
export const SITE_TITLE = "TUF Networks — The right room changes everything.";
export const SITE_DESCRIPTION =
  "TUF Networks is a curated network of founders, builders, creators and operators in Kerala, India, brought together around ideas, experiences and meaningful conversations. Request an invitation.";
export const SITE_SHORT_DESCRIPTION =
  "A curated network of founders, builders, creators and operators, brought together around ideas, experiences and meaningful conversations.";
export const SITE_OG_IMAGE = "/og-image.jpg";
export const SITE_OG_IMAGE_ALT = "Founders in conversation around a candlelit table.";

export interface NavItem {
  readonly label: string;
  readonly href: `#${string}`;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: "About", href: "#about" },
  { label: "The Room", href: "#the-room" },
  { label: "Experiences", href: "#experiences" },
  { label: "People", href: "#people" },
  { label: "Membership", href: "#membership" },
  { label: "FAQ", href: "#faq" },
] as const;

export const NAV_SECTION_IDS: readonly string[] = NAV_ITEMS.map((item) => item.href.slice(1));

function normalizeSiteUrl(value: string | undefined): string {
  if (!value) return "http://localhost:3000";

  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return "http://localhost:3000";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

/**
 * Canonical production origin. Set NEXT_PUBLIC_SITE_URL in every deployment.
 * The localhost fallback keeps local builds and previews working without
 * shipping a hard-coded company domain.
 */
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const IS_SITE_URL_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}
