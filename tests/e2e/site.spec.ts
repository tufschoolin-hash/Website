import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SECTION_IDS = [
  "top",
  "about",
  "the-room",
  "people",
  "experiences",
  "spaces",
  "opportunities",
  "network",
  "membership",
  "standard",
  "gallery",
  "vision",
  "apply",
  "faq",
] as const;

test.describe("home page", () => {
  test("renders all content, metadata and structured data without console errors", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page).toHaveTitle(/TUF Networks — The right room changes everything\./);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("The right");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("changes everything.");

    for (const id of SECTION_IDS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /curated network of founders/i,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /127\.0\.0\.1:3000|localhost:3000/,
    );

    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(structuredData.some((entry) => entry.includes('"@type":"Organization"'))).toBe(true);
    expect(structuredData.some((entry) => entry.includes('"@type":"WebSite"'))).toBe(true);
    expect(structuredData.some((entry) => entry.includes('"@type":"FAQPage"'))).toBe(true);

    expect(errors).toEqual([]);
  });

  test("desktop navigation links to the right section", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "Desktop navigation only");

    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About", exact: true })
      .click();

    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("FAQ items expand and collapse", async ({ page }) => {
    await page.goto("/#faq");

    const firstItem = page.locator("#faq details").first();
    await firstItem.locator("summary").click();

    await expect(firstItem).toHaveAttribute("open", "");
    await expect(firstItem).toContainText(
      "a curated network of founders, builders, creators and operators",
    );

    await firstItem.locator("summary").click();
    await expect(firstItem).not.toHaveAttribute("open", "");
  });

  test("application form submits successfully when the API accepts it", async ({ page }) => {
    let requestBody: Record<string, unknown> | null = null;

    await page.route("**/api/enquiries", async (route) => {
      requestBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          message: "Thank you — your application is in. We review every submission.",
        }),
      });
    });

    await page.goto("/#apply");
    await page.getByLabel("Full name").fill("Ada Lovelace");
    await page.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await page
      .getByLabel("What are you building?")
      .fill("A small studio building useful tools.");
    await page
      .getByLabel("Why do you want to be in the room?")
      .fill("I want to build alongside people who care about difficult, useful problems.");
    await page.getByLabel("I agree to be contacted about my application.").check();
    await page.getByRole("button", { name: "Submit application" }).click();

    await expect(page.getByRole("status")).toContainText("Thank you — your application is in.");
    expect(requestBody).not.toBeNull();
    const body = requestBody as unknown as Record<string, unknown>;
    expect(body.type).toBe("application");
    expect(body.consent).toBe(true);
    await expect(page.getByLabel("Full name")).toHaveValue("");
  });

  test("application form explains when applications are not yet open", async ({ page }) => {
    await page.route("**/api/enquiries", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          code: "not_configured",
          message:
            "Applications are opening soon. Nothing has been sent yet — please check back shortly.",
          contactEmail: "hello@example.com",
        }),
      });
    });

    await page.goto("/#apply");
    await page.getByLabel("Full name").fill("Ada Lovelace");
    await page.getByLabel("Email", { exact: true }).fill("ada@example.com");
    await page
      .getByLabel("What are you building?")
      .fill("A small studio building useful tools.");
    await page
      .getByLabel("Why do you want to be in the room?")
      .fill("I want to build alongside people who care about difficult, useful problems.");
    await page.getByLabel("I agree to be contacted about my application.").check();
    await page.getByRole("button", { name: "Submit application" }).click();

    await expect(page.getByRole("status")).toContainText("Applications are opening soon.");
    await expect(page.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
  });

  test("mobile navigation opens, closes on Escape and returns focus", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) > 1023, "Mobile navigation only");

    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();

    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("has no automatically detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const summary = results.violations.map((violation) => ({
      id: violation.id,
      help: violation.help,
      targets: violation.nodes.map((node) => node.target.join(" ")),
    }));

    expect(summary).toEqual([]);
  });

  test("captures full-page reference screenshots", async ({ page }, testInfo) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await page.screenshot({
      path: `test-results/reference-${testInfo.project.name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
});
