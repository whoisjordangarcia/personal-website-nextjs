export type ThemeId = "macchiato" | "mocha" | "frappe" | "latte";

export const THEMES: { id: ThemeId; label: string; note: string }[] = [
  { id: "macchiato", label: "Catppuccin Macchiato", note: "default" },
  { id: "mocha", label: "Catppuccin Mocha", note: "darkest" },
  { id: "frappe", label: "Catppuccin Frappé", note: "muted" },
  { id: "latte", label: "Catppuccin Latte", note: "light" },
];

export const DEFAULT_THEME: ThemeId = "macchiato";
export const THEME_STORAGE_KEY = "site-theme";

export function isTheme(v: unknown): v is ThemeId {
  return THEMES.some((t) => t.id === v);
}

/**
 * Runs in <head> before paint so a saved theme never flashes the default.
 * Kept tiny and dependency-free because it's inlined as a string.
 */
export const THEME_BOOT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(${JSON.stringify(
  THEMES.map((t) => t.id),
)}.indexOf(t)>-1)document.documentElement.dataset.theme=t}catch(e){}`;

const listeners = new Set<() => void>();

export function subscribeTheme(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** The saved theme (what Esc reverts to). */
export function getSavedTheme(): ThemeId {
  try {
    const t = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(t) ? t : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

/** Apply without saving: used for live preview while browsing the menu. */
export function previewTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
}

export function saveTheme(id: ThemeId) {
  previewTheme(id);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* private mode: the theme still applies for this page */
  }
  listeners.forEach((l) => l());
}
