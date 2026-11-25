/**
 * Bidirectional "knight rider" scanner, ported from opencode's
 * packages/cli-rs/crates/ui/src/motion/scanner.rs (MIT, anomalyco/opencode).
 * The head sweeps right, holds, sweeps back, then holds longer; a trail fades
 * behind it and unlit cells dim while holding.
 */
export type ScannerOptions = {
  width: number;
  holdStart: number;
  holdEnd: number;
  trailSteps: number;
  inactiveFactor: number;
};

export const SCANNER_DEFAULTS: ScannerOptions = {
  width: 8,
  holdStart: 30,
  holdEnd: 9,
  trailSteps: 6,
  inactiveFactor: 0.2,
};

export type ScannerCell = { glyph: string; alpha: number; lit: boolean };

const LIT = ["⬥", "◆", "⬩", "⬪"];
const UNLIT = "·";

export function scannerLength(o: ScannerOptions = SCANNER_DEFAULTS): number {
  return o.width + o.holdEnd + (o.width - 1) + o.holdStart;
}

type Phase = { holding: boolean; progress: number; total: number };
type State = { position: number; forward: boolean; phase: Phase };

function stateAt(frame: number, o: ScannerOptions): State {
  const chars = o.width;
  const backward = chars - 1;
  if (frame < chars) {
    return {
      position: frame,
      forward: true,
      phase: { holding: false, progress: frame, total: chars },
    };
  }
  if (frame < chars + o.holdEnd) {
    return {
      position: chars - 1,
      forward: true,
      phase: { holding: true, progress: frame - chars, total: o.holdEnd },
    };
  }
  if (frame < chars + o.holdEnd + backward) {
    const index = frame - chars - o.holdEnd;
    return {
      position: chars - 2 - index,
      forward: false,
      phase: { holding: false, progress: index, total: backward },
    };
  }
  return {
    position: 0,
    forward: false,
    phase: {
      holding: true,
      progress: frame - chars - o.holdEnd - backward,
      total: o.holdStart,
    },
  };
}

/** 0 at the head, distance along the trail, or -1 when unlit. */
function colorIndex(s: State, char: number, trail: number): number {
  const distance = s.forward ? s.position - char : char - s.position;
  if (s.phase.holding) return distance + s.phase.progress;
  if (distance > 0 && distance < trail) return distance;
  return distance === 0 ? 0 : -1;
}

/** Unlit cells fade out while holding and back in while moving. */
function fade(s: State): number {
  const { holding, progress, total } = s.phase;
  if (total <= 0) return 1;
  if (holding) return Math.max(0, 1 - Math.min(progress / total, 1));
  return Math.min(progress / Math.max(1, total - 1), 1);
}

/** Alpha per trail step: full head, slight bloom, then 0.65^n decay. */
function trailAlpha(step: number): number {
  if (step === 0) return 1;
  if (step === 1) return 0.9;
  return Math.pow(0.65, step - 1);
}

export function scannerFrame(
  frame: number,
  o: ScannerOptions = SCANNER_DEFAULTS,
): ScannerCell[] {
  const s = stateAt(
    ((frame % scannerLength(o)) + scannerLength(o)) % scannerLength(o),
    o,
  );
  return Array.from({ length: o.width }, (_, char) => {
    const index = colorIndex(s, char, o.trailSteps);
    if (index >= 0 && index < o.trailSteps) {
      return {
        glyph: LIT[Math.min(index, 3)]!,
        alpha: trailAlpha(index),
        lit: true,
      };
    }
    return { glyph: UNLIT, alpha: o.inactiveFactor * fade(s), lit: false };
  });
}
