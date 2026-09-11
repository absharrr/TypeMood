import { UserSettings, DayRecord, MoodState, RollingMetrics } from '../types/typing';

export interface ExtensionState {
  currentMood: MoodState;
  metrics: RollingMetrics;
  calmDurationMs: number;
  settings: UserSettings;
  history: Record<string, DayRecord>;
  floatingWidgetEnabled: boolean;
}

const DEFAULT_EXT_STATE: ExtensionState = {
  currentMood: 'IDLE',
  metrics: {
    wpm: 0,
    ikiMean: 0,
    ikiVariance: 0,
    backspaceCount: 0,
    backspaceRatio: 0,
    burstCount: 0,
    idleSeconds: 999,
    totalKeysInWindow: 0,
  },
  calmDurationMs: 0,
  settings: {
    notificationsEnabled: true,
    soundEnabled: true,
    darkTheme: true,
    theme: 'default',
    sensitivity: 'medium',
    currentSpecies: 'FERN',
    unlockedSpecies: ['FERN'],
  },
  history: {},
  floatingWidgetEnabled: true,
};

export class ExtensionStorage {
  public static async getState(): Promise<ExtensionState> {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['typemood_ext_state'], (result) => {
          if (result && result.typemood_ext_state) {
            resolve({ ...DEFAULT_EXT_STATE, ...result.typemood_ext_state });
          } else {
            resolve(DEFAULT_EXT_STATE);
          }
        });
      });
    } else {
      const data = localStorage.getItem('typemood_ext_state');
      return data ? { ...DEFAULT_EXT_STATE, ...JSON.parse(data) } : DEFAULT_EXT_STATE;
    }
  }

  public static async setState(partial: Partial<ExtensionState>): Promise<void> {
    const current = await this.getState();
    const updated = { ...current, ...partial };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ typemood_ext_state: updated }, () => resolve());
      });
    } else {
      localStorage.setItem('typemood_ext_state', JSON.stringify(updated));
    }
  }
}
