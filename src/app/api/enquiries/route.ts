import { createHash } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { deliverEnquiry, getContactEmail } from "@/lib/enquiry-delivery";
import { checkRateLimit } from "@/lib/rate-limit";
import { enquirySchema } from "@/lib/validation/enquiry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 20_000;

function noStoreHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    ...extra,
  };
}

function json(data: Record<string, unknown>, status: number, extraHeaders?: Record<string, string>) {
  return NextResponse.json(data, {
    status,
    headers: noStoreHeaders(extraHeaders),
  });
}

const SUCCESS_MESSAGE =
  "Thank you — your application is in. We review every submission and will be in touch if there’s a fit.";
const UNAVAILABLE_MESSAGE =
  "Applications are opening soon. Nothing has been sent yet — please check back shortly.";

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || request.headers.get("host");
    return Boolean(host) && originUrl.host === host;
  } catch {
    return false;
  }
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const forwardedIp = forwarded?.split(",")[0]?.trim();
  const ip = forwardedIp || request.headers.get("x-real-ip")?.trim() || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return json(
      {
        ok: false,
        code: "server_error",
        message: "This request could not be verified. Please refresh the page and try again.",
      },
      403,
    );
  }

  const limit = checkRateLimit(clientKey(request));
  if (!limit.allowed) {
    return json(
      {
        ok: false,
        code: "rate_limited",
        message: "Too many requests. Please wait a few minutes and try again.",
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  const contentType = request.headers.get("content-type");
  if (!contentType?.toLowerCase().startsWith("application/json")) {
    return json(
      { ok: false, code: "server_error", message: "Unsupported request format." },
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, code: "server_error", message: "That request was too large." }, 413);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return json(
      { ok: false, code: "invalid", message: "We couldn’t read that request. Please try again." },
      400,
    );
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "server_error", message: "That request was too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(
      { ok: false, code: "invalid", message: "We couldn’t read that request. Please try again." },
      400,
    );
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    const flattened = z.flattenError(parsed.error);

    for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
      const message = messages?.[0];
      if (message) fieldErrors[field] = message;
    }

    return json(
      {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields and try again.",
        fieldErrors,
      },
      400,
    );
  }

  const enquiry = parsed.data;

  // Bots fill hidden fields. Return a harmless success response without
  // delivering anything or revealing the trap.
  if (enquiry.companyWebsite?.trim()) {
    return json({ ok: true, message: SUCCESS_MESSAGE }, 200);
  }

  const delivery = await deliverEnquiry(enquiry);

  if (!delivery.delivered) {
    const contactEmail = getContactEmail();
    const notConfigured = delivery.reason === "not_configured";

    return json(
      {
        ok: false,
        code: notConfigured ? "not_configured" : "delivery_failed",
        message: notConfigured
          ? UNAVAILABLE_MESSAGE
          : "We couldn’t send that just now. Please try again in a moment.",
        ...(contactEmail ? { contactEmail } : {}),
      },
      notConfigured ? 503 : 502,
    );
  }

  return json({ ok: true, message: SUCCESS_MESSAGE }, 200);
}
