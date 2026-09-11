export type MoodState = 'CALM' | 'ERRATIC' | 'RAGE' | 'IDLE' | 'RECOVERING';

export type PlantSpecies = 'FERN' | 'BONSAI' | 'CACTUS' | 'GOLDEN_BLOSSOM';

export type ColorTheme = 'default' | 'sage' | 'crimson' | 'ocean' | 'forest';

export type KeyCategory = 'PRINTABLE' | 'BACKSPACE' | 'OTHER';

export interface KeystrokeEvent {
  timestamp: number;
  interKeyInterval: number; // ms since previous keystroke
  category: KeyCategory;
}

export interface RollingMetrics {
  wpm: number;
  ikiMean: number;        // ms
  ikiVariance: number;    // jitter standard deviation or variance
  backspaceCount: number; // backspaces in sliding window
  backspaceRatio: number; // backspaces / total keystrokes in window
  burstCount: number;     // rapid succession bursts
  idleSeconds: number;    // seconds since last keypress
  totalKeysInWindow: number;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  dominantMood: MoodState;
  healthScore: number; // 0 to 100
  totalKeystrokes: number;
  wpmAverage: number;
  moodDistribution: Record<MoodState, number>; // Percentage (0-100)
}

export type WeatherMetaphor = 'SERENE' | 'PARTLY_CLOUDY' | 'THUNDERSTORM' | 'STORM_WARNING' | 'FOGGY';

export interface WeatherReportData {
  startDate: string;
  endDate: string;
  totalKeystrokes: number;
  dominantWeather: WeatherMetaphor;
  healthScore: number;
  distribution: Record<WeatherMetaphor, number>; // % distribution
  headline: string;
  summaryText: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  darkTheme: boolean;
  theme: ColorTheme;
  sensitivity: 'low' | 'medium' | 'high'; // affects variance thresholds
  currentSpecies: PlantSpecies;
  unlockedSpecies: PlantSpecies[];
}

export interface GuiltToastMessage {
  id: string;
  mood: MoodState;
  text: string;
  timestamp: number;
}
