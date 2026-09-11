import { KeystrokeEvent, KeyCategory } from '../types/typing';

export class KeystrokeTracker {
  private events: KeystrokeEvent[] = [];
  private lastTimestamp: number | null = null;
  private windowDurationMs: number;
  private onMetricsUpdate: ((events: KeystrokeEvent[]) => void) | null = null;

  constructor(windowDurationMs: number = 8000) {
    this.windowDurationMs = windowDurationMs;
  }

  public handleKeyDown = (e: KeyboardEvent | { key: string; ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean }): void => {
    // Zero keylogging: strictly compute timestamps and key categories only!
    const now = Date.now();
    
    let category: KeyCategory = 'OTHER';
    if (e.key === 'Backspace' || e.key === 'Delete') {
      category = 'BACKSPACE';
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      category = 'PRINTABLE';
    }

    const interKeyInterval = this.lastTimestamp !== null ? Math.max(0, now - this.lastTimestamp) : 0;
    this.lastTimestamp = now;

    const event: KeystrokeEvent = {
      timestamp: now,
      interKeyInterval,
      category,
    };

    this.pushEvent(event);
  };

  public pushEvent(event: KeystrokeEvent): void {
    this.lastTimestamp = event.timestamp;
    this.events.push(event);
    this.pruneOldEvents(event.timestamp);

    if (this.onMetricsUpdate) {
      this.onMetricsUpdate([...this.events]);
    }
  }

  public pruneOldEvents(now: number = Date.now()): void {
    const cutoff = now - this.windowDurationMs;
    this.events = this.events.filter(e => e.timestamp >= cutoff);
  }

  public getEvents(): KeystrokeEvent[] {
    this.pruneOldEvents();
    return [...this.events];
  }

  public getLastKeyTimestamp(): number | null {
    return this.lastTimestamp;
  }

  public reset(): void {
    this.events = [];
    this.lastTimestamp = null;
  }

  public setUpdateCallback(callback: (events: KeystrokeEvent[]) => void): void {
    this.onMetricsUpdate = callback;
  }
}
