import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/enquiry-client", () => ({
  postEnquiry: vi.fn(),
}));

import { ApplicationForm } from "@/components/forms/application-form";
import { postEnquiry } from "@/lib/enquiry-client";

const mockPostEnquiry = vi.mocked(postEnquiry);
type UserEventApi = ReturnType<typeof userEvent.setup>;

async function fillApplication(user: UserEventApi) {
  await user.type(screen.getByLabelText(/Full name/), "Ada Lovelace");
  await user.type(screen.getByLabelText(/^Email/), "ada@example.com");
  await user.type(
    screen.getByLabelText(/What are you building/),
    "A small studio building useful tools.",
  );
  await user.type(
    screen.getByLabelText(/Why do you want to be in the room/),
    "I want to build alongside people who care about difficult, useful problems.",
  );
  await user.click(screen.getByLabelText(/I agree to be contacted/));
}

async function submit(user: UserEventApi) {
  await user.click(screen.getByRole("button", { name: /submit application/i }));
}

beforeEach(() => {
  mockPostEnquiry.mockReset();
});

describe("ApplicationForm", () => {
  it("shows accessible field errors and does not submit invalid data", async () => {
    const user = userEvent.setup();
    render(<ApplicationForm />);

    await submit(user);

    expect(await screen.findByText("Please enter a name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(screen.getByText("Please tell us what you’re building.")).toBeInTheDocument();
    expect(screen.getByText("Please confirm before submitting.")).toBeInTheDocument();
    expect(mockPostEnquiry).not.toHaveBeenCalled();

    const nameInput = screen.getByLabelText(/Full name/);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
  });

  it("submits a valid application, resets the fields and announces success", async () => {
    mockPostEnquiry.mockResolvedValue({
      status: 200,
      data: {
        ok: true,
        message: "Thank you — your application is in. We review every submission.",
      },
    });

    const user = userEvent.setup();
    render(<ApplicationForm />);

    await fillApplication(user);
    await submit(user);

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Thank you — your application is in.");
    await waitFor(() => expect(status).toHaveFocus());
    expect(screen.getByLabelText(/Full name/)).toHaveValue("");
    expect(screen.getByLabelText(/I agree to be contacted/)).not.toBeChecked();
    expect(mockPostEnquiry).toHaveBeenCalledWith(
      expect.objectContaining({ type: "application" }),
    );
  });

  it("shows the opening-soon message and contact email when delivery is not configured", async () => {
    mockPostEnquiry.mockResolvedValue({
      status: 503,
      data: {
        ok: false,
        code: "not_configured",
        message: "Applications are opening soon. Nothing has been sent yet — please check back shortly.",
        contactEmail: "hello@example.com",
      },
    });

    const user = userEvent.setup();
    render(<ApplicationForm />);

    await fillApplication(user);
    await submit(user);

    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Applications are opening soon.");
    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );
  });

  it("maps server-side field errors back onto the form", async () => {
    mockPostEnquiry.mockResolvedValue({
      status: 400,
      data: {
        ok: false,
        code: "invalid",
        message: "Please check the highlighted fields and try again.",
        fieldErrors: { email: "That email address is already on the list." },
      },
    });

    const user = userEvent.setup();
    render(<ApplicationForm />);

    await fillApplication(user);
    await submit(user);

    expect(
      await screen.findByText("That email address is already on the list."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Please check the highlighted fields");
  });

  it("handles a network failure without losing entered data", async () => {
    mockPostEnquiry.mockRejectedValue(new Error("Network unavailable"));

    const user = userEvent.setup();
    render(<ApplicationForm />);

    await fillApplication(user);
    await submit(user);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("We couldn’t submit the form just now.");
    expect(screen.getByLabelText(/Full name/)).toHaveValue("Ada Lovelace");
  });
});
