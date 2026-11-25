import { afterEach, describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemePicker from "./ThemePicker";
import { THEME_BOOT_SCRIPT, THEME_STORAGE_KEY } from "./theme";

afterEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe("ThemePicker", () => {
  it("marks the saved theme and focuses the dialog", () => {
    render(<ThemePicker onClose={vi.fn()} />);
    expect(screen.getByRole("dialog", { name: "Theme" })).toHaveFocus();
    expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
      "Catppuccin Macchiato",
    );
  });

  it("previews on arrow keys and saves on Enter", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ThemePicker onClose={onClose} />);

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
    render(<ThemePicker onClose={vi.fn()} />);

    await user.keyboard("{ArrowDown}{Escape}");
    expect(document.documentElement.dataset.theme).toBe("frappe");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("frappe");
  });

  it("applies a theme on tap / number key", async () => {
    const user = userEvent.setup();
    render(<ThemePicker onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /Catppuccin Latte/ }));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("latte");
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
