import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Marquee } from "@/components/sections/marquee";

describe("Marquee", () => {
  it("can be paused and resumed with an accessible control", async () => {
    const user = userEvent.setup();
    render(<Marquee />);

    const pause = screen.getByRole("button", { name: "Pause scrolling text" });
    expect(pause).toHaveAttribute("aria-pressed", "false");

    await user.click(pause);

    const play = screen.getByRole("button", { name: "Play scrolling text" });
    expect(play).toHaveAttribute("aria-pressed", "true");

    await user.click(play);
    expect(screen.getByRole("button", { name: "Pause scrolling text" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
