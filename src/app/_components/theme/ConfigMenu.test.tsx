import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigMenu from "./ConfigMenu";
import { FONT_BOOT_SCRIPT, FONT_STORAGE_KEY } from "./font";
import { THEME_BOOT_SCRIPT, THEME_STORAGE_KEY } from "./theme";

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
  delete document.documentElement.dataset.font;
});

describe("ConfigMenu", () => {
  it("marks the saved theme and focuses the dialog", () => {
    render(<ConfigMenu onClose={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Config" })).toHaveFocus();
    expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
      "Catppuccin Macchiato",
    );
  });

  it("previews on arrow keys and saves on Enter", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ConfigMenu onClose={onClose} />);

    await user.keyboard("{ArrowDown}");
    expect(document.documentElement.dataset.theme).toBe("mocha");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();

    await user.keyboard("{Enter}");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("mocha");
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("reverts the preview on Escape", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(THEME_STORAGE_KEY, "frappe");
    render(<ConfigMenu onClose={vi.fn()} />);

    await user.keyboard("{ArrowDown}{Escape}");
    expect(document.documentElement.dataset.theme).toBe("frappe");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("frappe");
  });

  it("applies a theme on tap / number key", async () => {
    const user = userEvent.setup();
    render(<ConfigMenu onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Catppuccin Latte/ }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("latte");
  });
});

describe("ConfigMenu font tab", () => {
  it("switches to Font with the arrow keys and saves Geist Mono", async () => {
    const user = userEvent.setup();
    render(<ConfigMenu onClose={vi.fn()} />);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Font",
    );
    await user.keyboard("{ArrowDown}");
    expect(document.documentElement.dataset.font).toBe("geist");

    await user.keyboard("{Enter}");
    expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBe("geist");
  });

  it("opens straight on the font tab and reverts both on Escape", async () => {
    const user = userEvent.setup();
    render(<ConfigMenu initialTab="font" onClose={vi.fn()} />);

    await user.keyboard("{ArrowDown}{Escape}");
    expect(document.documentElement.dataset.font).toBe("ioskeley");
    expect(window.localStorage.getItem(FONT_STORAGE_KEY)).toBeNull();
  });

  it("boots a saved font before paint", () => {
    window.localStorage.setItem(FONT_STORAGE_KEY, "jetbrains");
    new Function(FONT_BOOT_SCRIPT)();
    expect(document.documentElement.dataset.font).toBe("jetbrains");
  });
});

describe("THEME_BOOT_SCRIPT", () => {
  it("applies a saved theme and ignores junk", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "latte");
    new Function(THEME_BOOT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBe("latte");

    delete document.documentElement.dataset.theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, "</script><b>");
    new Function(THEME_BOOT_SCRIPT)();
    expect(document.documentElement.dataset.theme).toBeUndefined();
  });
});
