import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/enquiry-delivery", () => ({
  deliverEnquiry: vi.fn(),
  getContactEmail: vi.fn(),
}));

import { POST } from "@/app/api/enquiries/route";
import { deliverEnquiry, getContactEmail } from "@/lib/enquiry-delivery";

const mockDeliver = vi.mocked(deliverEnquiry);
const mockContactEmail = vi.mocked(getContactEmail);

let ipCounter = 1;

function nextIp(): string {
  ipCounter += 1;
  return `10.0.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`;
}

const validPayload = {
  type: "application",
  name: "Ada Lovelace",
  email: "ada@example.com",
  building: "An early-stage computing studio.",
  link: "",
  curious: "",
  why: "I want to build with people who care about difficult, useful problems.",
  consent: true,
  companyWebsite: "",
};

interface RequestOptions {
  ip?: string;
  origin?: string;
  contentType?: string;
  rawBody?: string;
}

function makeRequest(body: unknown = validPayload, options: RequestOptions = {}): Request {
  const headers = new Headers({
    "content-type": options.contentType ?? "application/json",
    "x-forwarded-for": options.ip ?? nextIp(),
  });

  if (options.origin) headers.set("origin", options.origin);
  if (options.origin) headers.set("x-forwarded-host", "localhost");

  return new Request("http://localhost/api/enquiries", {
    method: "POST",
    headers,
    body: options.rawBody ?? JSON.stringify(body),
  });
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

beforeEach(() => {
  mockDeliver.mockReset();
  mockContactEmail.mockReset();
  mockContactEmail.mockReturnValue(undefined);
});

describe("POST /api/enquiries", () => {
  it("rejects cross-origin submissions", async () => {
    const response = await POST(
      makeRequest(validPayload, { origin: "https://evil.example" }),
    );

    expect(response.status).toBe(403);
    const data = await readJson(response);
    expect(data.ok).toBe(false);
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("requires a JSON content type", async () => {
    const response = await POST(makeRequest(validPayload, { contentType: "text/plain" }));

    expect(response.status).toBe(415);
  });

  it("rejects malformed JSON with a helpful message", async () => {
    const response = await POST(makeRequest(undefined, { rawBody: "{" }));

    expect(response.status).toBe(400);
    const data = await readJson(response);
    expect(data.message).toMatch(/couldn’t read that request/i);
  });

  it("returns field errors without delivering invalid data", async () => {
    const response = await POST(
      makeRequest({
        ...validPayload,
        name: "",
        email: "not-an-email",
        consent: false,
      }),
    );

    expect(response.status).toBe(400);
    const data = await readJson(response);
    expect(data.code).toBe("invalid");

    const fieldErrors = data.fieldErrors as Record<string, string>;
    expect(fieldErrors.name).toBe("Please enter a name.");
    expect(fieldErrors.email).toContain("valid email");
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("delivers a valid application", async () => {
    mockDeliver.mockResolvedValue({ delivered: true });

    const response = await POST(makeRequest());

    expect(response.status).toBe(200);
    const data = await readJson(response);
    expect(data.ok).toBe(true);
    expect(data.message).toContain("application is in");
    expect(mockDeliver).toHaveBeenCalledTimes(1);
  });

  it("silently accepts honeypot submissions without delivering them", async () => {
    const response = await POST(
      makeRequest({ ...validPayload, companyWebsite: "https://spam.example" }),
    );

    expect(response.status).toBe(200);
    const data = await readJson(response);
    expect(data.ok).toBe(true);
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("returns 503 and the configured contact email when delivery is not configured", async () => {
    mockDeliver.mockResolvedValue({ delivered: false, reason: "not_configured" });
    mockContactEmail.mockReturnValue("hello@example.com");

    const response = await POST(makeRequest());

    expect(response.status).toBe(503);
    const data = await readJson(response);
    expect(data.code).toBe("not_configured");
    expect(data.contactEmail).toBe("hello@example.com");
    expect(data.message).toMatch(/opening soon/i);
  });

  it("returns 502 when the delivery provider fails", async () => {
    mockDeliver.mockResolvedValue({ delivered: false, reason: "delivery_failed" });

    const response = await POST(makeRequest());

    expect(response.status).toBe(502);
    const data = await readJson(response);
    expect(data.code).toBe("delivery_failed");
    expect(data.message).toMatch(/couldn’t send that just now/i);
  });

  it("rejects oversized bodies", async () => {
    const response = await POST(
      makeRequest(undefined, { rawBody: "a".repeat(20_001) }),
    );

    expect(response.status).toBe(413);
  });

  it("rate limits repeated submissions from the same address", async () => {
    mockDeliver.mockResolvedValue({ delivered: true });
    const ip = nextIp();

    for (let index = 0; index < 5; index += 1) {
      const response = await POST(makeRequest(validPayload, { ip }));
      expect(response.status).toBe(200);
    }

    const limited = await POST(makeRequest(validPayload, { ip }));

    expect(limited.status).toBe(429);
    expect(limited.headers.get("retry-after")).toMatch(/^\d+$/);
    const data = await readJson(limited);
    expect(data.code).toBe("rate_limited");
  });
});
