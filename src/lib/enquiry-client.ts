export interface EnquiryApiResponse {
  ok: boolean;
  code?: "invalid" | "rate_limited" | "not_configured" | "delivery_failed" | "server_error";
  message: string;
  contactEmail?: string;
  fieldErrors?: Record<string, string>;
}

export interface EnquiryApiResult {
  status: number;
  data: EnquiryApiResponse;
}

interface EnquiryRequest {
  type: "application";
  payload: Record<string, unknown>;
}

const REQUEST_TIMEOUT_MS = 20_000;

/**
 * Client-side transport for the internal enquiry endpoint. The browser never
 * talks to a third-party form service directly, so no provider token can leak.
 */
export async function postEnquiry({ type, payload }: EnquiryRequest): Promise<EnquiryApiResult> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/enquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...payload, type }),
      signal: controller.signal,
    });

    let data: EnquiryApiResponse;

    try {
      data = (await response.json()) as EnquiryApiResponse;
    } catch {
      throw new Error("The enquiry service returned an unreadable response.");
    }

    if (typeof data.message !== "string") {
      throw new Error("The enquiry service returned an unexpected response.");
    }

    return { status: response.status, data };
  } finally {
    window.clearTimeout(timeout);
  }
}
