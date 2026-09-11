import { DayRecord, MoodState, UserSettings } from '../types/typing';

const SETTINGS_KEY = 'typemood_user_settings_v1';
const HISTORY_KEY = 'typemood_daily_history_v1';

const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  darkTheme: true,
  theme: 'default',
  sensitivity: 'medium',
  currentSpecies: 'FERN',
  unlockedSpecies: ['FERN'],
};

export class StorageService {
  public static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to parse settings from LocalStorage', e);
    }
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  public static getTodayDateString(): string {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }

  public static getHistory(): Record<string, DayRecord> {
    try {
      const data = localStorage.getItem(HISTORY_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse history from LocalStorage', e);
    }
    return this.generateDefaultSampleHistory();
  }

  public static saveHistory(history: Record<string, DayRecord>): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  }

  /**
   * Log a real-time mood tick (e.g. every 2 seconds) to accumulate stats for today
   */
  public static recordMoodTick(mood: MoodState, keystrokesInTick: number, currentWpm: number): void {
    const today = this.getTodayDateString();
    const history = this.getHistory();

    const record: DayRecord = history[today] || {
      date: today,
      dominantMood: 'CALM',
      healthScore: 85,
      totalKeystrokes: 0,
      wpmAverage: 0,
      moodDistribution: {
        CALM: 0,
        ERRATIC: 0,
        RAGE: 0,
        IDLE: 0,
        RECOVERING: 0,
      },
    };

    // Update raw counters
    record.totalKeystrokes += keystrokesInTick;
    if (currentWpm > 0) {
      record.wpmAverage = record.wpmAverage === 0 ? currentWpm : Math.round((record.wpmAverage * 0.9) + (currentWpm * 0.1));
    }

    // Increment mood tick counts in temporary bucket
    const dist = record.moodDistribution;
    dist[mood] = (dist[mood] || 0) + 1;

    // Recalculate dominant mood
    let maxVal = -1;
    let dominant: MoodState = 'CALM';
    Object.entries(dist).forEach(([m, count]) => {
      if (count > maxVal && m !== 'IDLE') {
        maxVal = count;
        dominant = m as MoodState;
      }
    });
    record.dominantMood = dominant;

    // Recalculate plant health score (0-100)
    const totalTicks = Object.values(dist).reduce((a, b) => a + b, 0);
    if (totalTicks > 0) {
      const calmPercent = ((dist.CALM + dist.RECOVERING) / totalTicks) * 100;
      const ragePercent = (dist.RAGE / totalTicks) * 100;
      const erraticPercent = (dist.ERRATIC / totalTicks) * 100;

      const health = Math.max(10, Math.min(100, Math.round(calmPercent + 20 - (ragePercent * 1.5) - (erraticPercent * 0.8))));
      record.healthScore = health;
    }

    history[today] = record;
    this.saveHistory(history);
    this.checkPlantEvolution(history);
  }

  private static checkPlantEvolution(history: Record<string, DayRecord>): void {
    const settings = this.getSettings();
    const records = Object.values(history);
    if (records.length < 1) return;

    let unlockedNew = false;
    const newUnlocked = [...settings.unlockedSpecies];

    const avgHealth = records.reduce((acc, r) => acc + r.healthScore, 0) / records.length;
    if (avgHealth >= 75 && !newUnlocked.includes('BONSAI')) {
      newUnlocked.push('BONSAI');
      unlockedNew = true;
    }

    const totalKeystrokes = records.reduce((acc, r) => acc + r.totalKeystrokes, 0);
    if (totalKeystrokes > 2000 && !newUnlocked.includes('CACTUS')) {
      newUnlocked.push('CACTUS');
      unlockedNew = true;
    }

    if (totalKeystrokes > 5000 && avgHealth >= 80 && !newUnlocked.includes('GOLDEN_BLOSSOM')) {
      newUnlocked.push('GOLDEN_BLOSSOM');
      unlockedNew = true;
    }

    if (unlockedNew) {
      settings.unlockedSpecies = newUnlocked;
      this.saveSettings(settings);
    }
  }

  public static generateDefaultSampleHistory(): Record<string, DayRecord> {
    const history: Record<string, DayRecord> = {};
    const today = new Date();
    
    const moods: MoodState[] = ['CALM', 'CALM', 'ERRATIC', 'CALM', 'RAGE', 'CALM', 'RECOVERING'];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const dominant = moods[i % moods.length];
      const healthScore = dominant === 'CALM' ? Math.floor(75 + Math.random() * 20) :
                         dominant === 'ERRATIC' ? Math.floor(45 + Math.random() * 25) :
                         dominant === 'RAGE' ? Math.floor(25 + Math.random() * 20) : 80;

      history[dateStr] = {
        date: dateStr,
        dominantMood: dominant,
        healthScore,
        totalKeystrokes: Math.floor(400 + Math.random() * 1200),
        wpmAverage: Math.floor(45 + Math.random() * 35),
        moodDistribution: {
          CALM: dominant === 'CALM' ? 65 : 25,
          ERRATIC: dominant === 'ERRATIC' ? 55 : 20,
          RAGE: dominant === 'RAGE' ? 60 : 10,
          IDLE: 15,
          RECOVERING: 15,
        },
      };
    }

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  }
}
