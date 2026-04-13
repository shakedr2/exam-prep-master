import confetti from "canvas-confetti";

/**
 * Fires a celebratory confetti burst.
 * Uses canvas-confetti for a lightweight (<6 KB gzipped) full-screen effect.
 *
 * @param options - override defaults for the burst
 */
export function fireConfetti(options?: confetti.Options): void {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.5 },
    colors: ["#7c3aed", "#a78bfa", "#22c55e", "#facc15", "#f97316"],
    ...options,
  });
}

/**
 * Fires a double-burst "topic mastered" celebration.
 * Shoots from both bottom corners for a Duolingo-style effect.
 */
export function fireTopicMasteredConfetti(): void {
  // Left burst
  confetti({
    particleCount: 70,
    angle: 60,
    spread: 60,
    origin: { x: 0, y: 0.9 },
    colors: ["#7c3aed", "#a78bfa", "#22c55e", "#facc15"],
  });
  // Right burst
  confetti({
    particleCount: 70,
    angle: 120,
    spread: 60,
    origin: { x: 1, y: 0.9 },
    colors: ["#7c3aed", "#a78bfa", "#22c55e", "#facc15"],
  });
}
