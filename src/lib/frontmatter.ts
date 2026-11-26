export type FrontmatterValue = string | number | boolean;
export type Frontmatter = Record<string, FrontmatterValue>;

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---[^\S\r\n]*(?:\r?\n|$)/;

/**
 * Parses the flat `key: value` frontmatter our articles use: strings
 * (bare or quoted), numbers and booleans. Anything YAML-ish beyond that
 * (lists, nesting) throws, so an unsupported article fails loudly at build
 * time instead of rendering wrong metadata.
 */
export function parseFrontmatter(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const match = FENCE.exec(raw);
  if (!match) return { data: {}, content: raw };

  const data: Frontmatter = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colon = line.indexOf(":");
    const key = colon === -1 ? "" : line.slice(0, colon).trim();
    if (!/^[A-Za-z_][\w-]*$/.test(key) || line !== line.trimStart()) {
      throw new Error(`Unsupported frontmatter line: "${line}"`);
    }
    data[key] = parseScalar(line.slice(colon + 1).trim());
  }

  return { data, content: raw.slice(match[0].length) };
}

function parseScalar(value: string): FrontmatterValue {
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return JSON.parse(value) as string;
  }
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (/^[[{|>&*!-]/.test(value)) {
    throw new Error(`Unsupported frontmatter value: "${value}"`);
  }
  return value;
}
