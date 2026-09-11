import { MoodState, RollingMetrics } from '../types/typing';

export class MoodClassifier {
  private currentMood: MoodState = 'IDLE';
  private history: MoodState[] = [];
  private calmDurationMs: number = 0;
  private lastEvaluationTime: number = Date.now();

  /**
   * Classify candidate mood state based on rolling metrics and thresholds
   */
  public classifyRaw(metrics: RollingMetrics, sensitivity: 'low' | 'medium' | 'high' = 'medium'): MoodState {
    // Threshold multipliers based on sensitivity
    const sensitivityMultiplier = sensitivity === 'high' ? 0.8 : sensitivity === 'low' ? 1.2 : 1.0;

    // 1. Idle condition (> 15 seconds without keypress)
    if (metrics.idleSeconds > 15 || metrics.totalKeysInWindow < 3) {
      return 'IDLE';
    }

    // Thresholds
    const rageWpmThreshold = 50 * sensitivityMultiplier;
    const rageBurstThreshold = 3 * sensitivityMultiplier;
    const highBackspaceRatio = 0.20 / sensitivityMultiplier; // > 20% backspaces
    const highVarianceThreshold = 140 / sensitivityMultiplier; // > 140ms std dev
    const lowVarianceThreshold = 95 * sensitivityMultiplier;

    // 2. Aggressive / Rage Condition (Fast typing OR heavy backspace slam triggers RAGE!)
    const isFastTyping = metrics.wpm >= rageWpmThreshold || metrics.burstCount >= rageBurstThreshold || (metrics.ikiMean > 0 && metrics.ikiMean <= 140 * sensitivityMultiplier);
    const isHeavyBackspace = metrics.backspaceRatio >= highBackspaceRatio || metrics.backspaceCount >= 3;

    if (isFastTyping || isHeavyBackspace) {
      return 'RAGE';
    }

    // 3. Erratic / Anxious Condition
    if (metrics.ikiVariance >= highVarianceThreshold || metrics.backspaceRatio >= highBackspaceRatio) {
      return 'ERRATIC';
    }

    // 4. Calm / Steady Condition
    if (
      metrics.ikiVariance <= lowVarianceThreshold &&
      metrics.backspaceRatio < 0.15 &&
      metrics.wpm >= 15
    ) {
      return 'CALM';
    }

    // Default fall-through for moderate input
    return 'CALM';
  }

  /**
   * Apply hysteresis / smoothing buffer to avoid state flickering
   */
  public update(metrics: RollingMetrics, sensitivity: 'low' | 'medium' | 'high' = 'medium'): MoodState {
    const now = Date.now();
    const deltaMs = now - this.lastEvaluationTime;
    this.lastEvaluationTime = now;

    const rawCandidate = this.classifyRaw(metrics, sensitivity);

    // Keep candidate history (last 3 evaluations)
    this.history.push(rawCandidate);
    if (this.history.length > 3) {
      this.history.shift();
    }

    // Hysteresis logic: require 2 matching consecutive signals to transition away from current state
    const recentMatches = this.history.filter(m => m === rawCandidate).length;
    let nextState = this.currentMood;

    if (recentMatches >= 2 || rawCandidate === 'IDLE' || rawCandidate === 'RAGE') {
      nextState = rawCandidate;
    }

    // Check for Recovering state (transition from RAGE/ERRATIC to CALM)
    if (
      (this.currentMood === 'RAGE' || this.currentMood === 'ERRATIC') &&
      nextState === 'CALM'
    ) {
      nextState = 'RECOVERING';
    }

    // Track calm duration for blooming logic
    if (nextState === 'CALM' || nextState === 'RECOVERING') {
      this.calmDurationMs += deltaMs;
    } else {
      this.calmDurationMs = 0;
    }

    this.currentMood = nextState;
    return this.currentMood;
  }

  public getCalmDurationMs(): number {
    return this.calmDurationMs;
  }

  public getCurrentMood(): MoodState {
    return this.currentMood;
  }

  public reset(): void {
    this.currentMood = 'IDLE';
    this.history = [];
    this.calmDurationMs = 0;
    this.lastEvaluationTime = Date.now();
  }
}
