export type FontId =
  "ioskeley" | "geist" | "jetbrains" | "fira" | "plex" | "system";

export const FONTS: { id: FontId; label: string; note: string }[] = [
  { id: "ioskeley", label: "Ioskeley Mono", note: "default" },
  { id: "geist", label: "Geist Mono", note: "Vercel" },
  { id: "jetbrains", label: "JetBrains Mono", note: "tall x-height" },
  { id: "fira", label: "Fira Code", note: "ligatures" },
  { id: "plex", label: "IBM Plex Mono", note: "classic" },
  { id: "system", label: "System mono", note: "no download" },
];

export const DEFAULT_FONT: FontId = "ioskeley";
export const FONT_STORAGE_KEY = "site-font";

export function isFont(v: unknown): v is FontId {
  return FONTS.some((f) => f.id === v);
}

/** Inline <head> script: applies a saved font before paint. */
export const FONT_BOOT_SCRIPT = `try{var f=localStorage.getItem("${FONT_STORAGE_KEY}");if(${JSON.stringify(
  FONTS.map((f) => f.id),
)}.indexOf(f)>-1)document.documentElement.dataset.font=f}catch(e){}`;

export function getSavedFont(): FontId {
  try {
    const f = window.localStorage.getItem(FONT_STORAGE_KEY);
    return isFont(f) ? f : DEFAULT_FONT;
  } catch {
    return DEFAULT_FONT;
  }
}

export function previewFont(id: FontId) {
  document.documentElement.dataset.font = id;
}

export function saveFont(id: FontId) {
  previewFont(id);
  try {
    window.localStorage.setItem(FONT_STORAGE_KEY, id);
  } catch {
    /* private mode: applies for this page only */
  }
}
