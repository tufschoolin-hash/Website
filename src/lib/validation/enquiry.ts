import { z } from "zod";

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_URL = 300;
const MAX_LONG_TEXT = 2_000;

const emailFormat = z.email();

export function isEmail(value: string): boolean {
  return value.length <= MAX_EMAIL && emailFormat.safeParse(value).success;
}

export function isWebUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_URL) return false;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    const hostname = url.hostname;
    return hostname.includes(".") && !hostname.startsWith(".") && !hostname.endsWith(".");
  } catch {
    return false;
  }
}

const requiredNameField = z
  .string()
  .trim()
  .min(1, "Please enter a name.")
  .min(2, "Please enter at least 2 characters.")
  .max(MAX_NAME, "Please keep this under 100 characters.");

const emailField = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(MAX_EMAIL, "Please keep this under 254 characters.")
  .pipe(z.email({ error: "Please enter a valid email address, like you@example.com." }));

const optionalUrlField = z
  .string()
  .trim()
  .max(MAX_URL, "Please keep this under 300 characters.")
  .refine((value) => value === "" || isWebUrl(value), {
    error: "Please enter a valid website or LinkedIn URL.",
  });

const longTextField = (requiredMessage: string, minLength = 2) =>
  z
    .string()
    .trim()
    .min(1, requiredMessage)
    .min(minLength, "Please share a little more.")
    .max(MAX_LONG_TEXT, "Please keep this under 2,000 characters.");

const whyField = z
  .string()
  .trim()
  .min(1, "Please tell us why you want to be in the room.")
  .min(20, "Please share a little more — at least 20 characters.")
  .max(MAX_LONG_TEXT, "Please keep this under 2,000 characters.");

const consentField = z.boolean().refine((value) => value, {
  error: "Please confirm before submitting.",
});

const honeypotField = z.string().max(200).optional();

export const applicationSchema = z.object({
  name: requiredNameField,
  email: emailField,
  building: longTextField("Please tell us what you’re building."),
  link: optionalUrlField,
  curious: z
    .string()
    .trim()
    .max(MAX_LONG_TEXT, "Please keep this under 2,000 characters."),
  why: whyField,
  consent: consentField,
  companyWebsite: honeypotField,
});

export const enquirySchema = applicationSchema.extend({
  type: z.literal("application"),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;
export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryType = Enquiry["type"];
export type ApplicationFieldName = keyof ApplicationValues;
