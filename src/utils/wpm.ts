export function calculateWPM(charsTyped: number, secondsElapsed: number): number {
  return Math.round((charsTyped / 5) / (secondsElapsed / 60));
}
