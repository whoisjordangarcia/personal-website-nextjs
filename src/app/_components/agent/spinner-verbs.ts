/**
 * What the agent skin says while it "thinks". One is picked per prompt,
 * in the spirit of coding agents' whimsical spinner verbs.
 */
export const SPINNER_VERBS = [
  "Caffeinating",
  "Bikeshedding",
  "Yak-shaving",
  "Rubber-ducking",
  "Grepping the void",
  "Aligning pixels",
  "Bun-installing",
  "Type-checking feelings",
  "Overengineering",
  "Hydrating",
  "Tailwinding",
  "Rebasing reality",
  "Squashing commits",
  "Splitting panes",
  "Consulting the dotfiles",
  "Running a quick 10k",
  "Brewing a flat white",
  "Applying sunscreen",
  "Reading the docs (finally)",
  "Negotiating with ESLint",
  "Downgrading expectations",
  "Pretending to think",
];

/** Picks a verb, avoiding an immediate repeat of `previous`. */
export function pickVerb(previous?: string, random = Math.random): string {
  const pool = SPINNER_VERBS.filter((v) => v !== previous);
  return pool[Math.floor(random() * pool.length)] ?? SPINNER_VERBS[0]!;
}
