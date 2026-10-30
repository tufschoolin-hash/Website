import { describe, expect, it } from "vitest";

import { applicationSchema, isEmail, isWebUrl } from "@/lib/validation/enquiry";

const validApplication = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  building: "An early-stage computing studio.",
  link: "https://example.com",
  curious: "Computing, systems and strange machines.",
  why: "I want to build with people who care about difficult, useful problems.",
  consent: true,
  companyWebsite: "",
};

describe("email and URL helpers", () => {
  it("accepts valid email addresses and rejects malformed ones", () => {
    expect(isEmail("person@example.com")).toBe(true);
    expect(isEmail("person@example")).toBe(false);
    expect(isEmail("not-an-email")).toBe(false);
    expect(isEmail("person@example.com ")).toBe(false);
  });

  it("accepts bare domains and full URLs, but rejects unsafe or malformed input", () => {
    expect(isWebUrl("example.com")).toBe(true);
    expect(isWebUrl("https://www.linkedin.com/in/example")).toBe(true);
    expect(isWebUrl("javascript:alert(1)")).toBe(false);
    expect(isWebUrl("not a url")).toBe(false);
    expect(isWebUrl("")).toBe(false);
  });
});

describe("applicationSchema", () => {
  it("accepts a complete application", () => {
    const result = applicationSchema.safeParse(validApplication);
    expect(result.success).toBe(true);
  });

  it("allows the optional link and curious fields to be empty", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      link: "",
      curious: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty application with field-level messages", () => {
    const result = applicationSchema.safeParse({
      name: "",
      email: "",
      building: "",
      link: "",
      curious: "",
      why: "",
      consent: false,
      companyWebsite: "",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = result.error.flatten().fieldErrors;
    expect(errors.name?.[0]).toBe("Please enter a name.");
    expect(errors.email?.[0]).toBe("Please enter your email address.");
    expect(errors.consent?.[0]).toBe("Please confirm before submitting.");
  });

  it("rejects a short reason and a non-http link", () => {
    const result = applicationSchema.safeParse({
      ...validApplication,
      why: "Because.",
      link: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = result.error.flatten().fieldErrors;
    expect(errors.why?.[0]).toContain("at least 20 characters");
    expect(errors.link?.[0]).toBe("Please enter a valid website or LinkedIn URL.");
  });
});

