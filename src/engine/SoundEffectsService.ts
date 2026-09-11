import { MoodState } from '../types/typing';

export class SoundEffectsService {
  private ctx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playMoodSound(mood: MoodState, enabled: boolean = true): void {
    if (!enabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (mood) {
      case 'CALM':
        this.playCalmBloomChime(ctx, now);
        break;
      case 'ERRATIC':
        this.playErraticWobble(ctx, now);
        break;
      case 'RAGE':
        this.playRageRumble(ctx, now);
        break;
      case 'IDLE':
        this.playIdleLullaby(ctx, now);
        break;
      case 'RECOVERING':
        this.playRecoveryChord(ctx, now);
        break;
    }
  }

  // 🌸 CALM: Serene major pentatonic bell chime (C5 -> E5 -> G5 -> C6)
  private playCalmBloomChime(ctx: AudioContext, now: number): void {
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.65);
    });
  }

  // 🥀 ERRATIC: Quirky descending pitch wobble
  private playErraticWobble(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 🌋 RAGE: Retro 8-bit bass rumble
  private playRageRumble(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // 💤 IDLE: Soft two-note lullaby (G4 -> C4)
  private playIdleLullaby(ctx: AudioContext, now: number): void {
    const freqs = [392.00, 261.63];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.2);

      gain.gain.setValueAtTime(0.001, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.1, now + i * 0.2 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.55);
    });
  }

  // 🌱 RECOVERING: Uplifting major triad (C4 -> E4 -> G4)
  private playRecoveryChord(ctx: AudioContext, now: number): void {
    const freqs = [261.63, 329.63, 392.00];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.001, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.55);
    });
  }
}

export const soundEffects = new SoundEffectsService();
