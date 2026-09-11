import { KeystrokeEvent, RollingMetrics } from '../types/typing';

export class MetricsCalculator {
  public static calculate(events: KeystrokeEvent[], lastKeyTimestamp: number | null, windowMs: number = 8000): RollingMetrics {
    const now = Date.now();
    const idleMs = lastKeyTimestamp ? Math.max(0, now - lastKeyTimestamp) : Infinity;
    const idleSeconds = idleMs === Infinity ? 999 : idleMs / 1000;

    if (events.length === 0) {
      return {
        wpm: 0,
        ikiMean: 0,
        ikiVariance: 0,
        backspaceCount: 0,
        backspaceRatio: 0,
        burstCount: 0,
        idleSeconds,
        totalKeysInWindow: 0,
      };
    }

    const totalKeysInWindow = events.length;
    const windowSeconds = Math.min(windowMs / 1000, Math.max(1, (now - events[0].timestamp) / 1000));
    
    // WPM calculation: standard formula is (keystrokes / 5) / minutes
    const estimatedWords = totalKeysInWindow / 5;
    const minutes = windowSeconds / 60;
    const wpm = Math.round(estimatedWords / minutes);

    // Inter-key interval (exclude first event or idle gaps > 2 seconds)
    const validIntervals = events
      .map(e => e.interKeyInterval)
      .filter(iki => iki > 0 && iki < 2000);

    let ikiMean = 0;
    let ikiVariance = 0;

    if (validIntervals.length > 0) {
      const sum = validIntervals.reduce((acc, val) => acc + val, 0);
      ikiMean = sum / validIntervals.length;

      // Variance calculation
      const squaredDiffs = validIntervals.map(val => Math.pow(val - ikiMean, 2));
      const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / validIntervals.length;
      ikiVariance = Math.sqrt(avgSquaredDiff); // Standard deviation in ms
    }

    // Backspace metrics
    const backspaceCount = events.filter(e => e.category === 'BACKSPACE').length;
    const backspaceRatio = totalKeysInWindow > 0 ? backspaceCount / totalKeysInWindow : 0;

    // Burst detection (intervals < 130ms indicate rapid burst typing)
    const burstCount = validIntervals.filter(iki => iki < 130).length;

    return {
      wpm,
      ikiMean: Math.round(ikiMean),
      ikiVariance: Math.round(ikiVariance),
      backspaceCount,
      backspaceRatio,
      burstCount,
      idleSeconds,
      totalKeysInWindow,
    };
  }
}
