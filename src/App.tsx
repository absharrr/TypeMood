import React, { useEffect, useRef, useState, useMemo } from 'react';
import { MoodState, RollingMetrics, UserSettings, DayRecord, GuiltToastMessage, ColorTheme } from './types/typing';
import { KeystrokeTracker } from './engine/KeystrokeTracker';
import { MetricsCalculator } from './engine/MetricsCalculator';
import { MoodClassifier } from './engine/MoodClassifier';
import { StorageService } from './engine/StorageService';
import { ExtensionStorage, ExtensionState } from './extension/ExtensionStorage';
import { soundEffects } from './engine/SoundEffectsService';
import { GUILT_QUOTES } from './constants/quotes';

import { Header } from './components/Header';
import { PlantCanvas } from './components/PlantDisplay/PlantCanvas';
import { TypingArea } from './components/Editor/TypingArea';
import { ExtensionDashboard } from './components/Editor/ExtensionDashboard';
import { MoodRingHeatmap } from './components/Analytics/MoodRingHeatmap';
import { WeatherReport } from './components/Analytics/WeatherReport';
import { GuiltToast } from './components/Notifications/GuiltToast';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import { SpeciesModal } from './components/Modals/SpeciesModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { ShieldCheck, Chrome } from 'lucide-react';

export const App: React.FC = () => {
  // Engine references
  const tracker = useMemo(() => new KeystrokeTracker(8000), []);
  const classifier = useMemo(() => new MoodClassifier(), []);

  const isExtensionEnvironment = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

  // Application state
  const [metrics, setMetrics] = useState<RollingMetrics>({
    wpm: 0,
    ikiMean: 0,
    ikiVariance: 0,
    backspaceCount: 0,
    backspaceRatio: 0,
    burstCount: 0,
    idleSeconds: 999,
    totalKeysInWindow: 0,
  });

  const [mood, setMood] = useState<MoodState>('IDLE');
  const [calmDurationMs, setCalmDurationMs] = useState<number>(0);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [history, setHistory] = useState<Record<string, DayRecord>>(StorageService.getHistory());
  const [activeTab, setActiveTab] = useState<'editor' | 'dashboard' | 'analytics' | 'weather'>('editor');

  // Modals
  const [privacyOpen, setPrivacyOpen] = useState<boolean>(false);
  const [speciesOpen, setSpeciesOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  // Guilt Toast
  const [toast, setToast] = useState<GuiltToastMessage | null>(null);

  // Previous mood ref for transition sound & notification detection
  const prevMoodRef = useRef<MoodState>('IDLE');

  // Today's record health score
  const todayStr = StorageService.getTodayDateString();
  const todayRecord = history[todayStr];
  const currentHealth = todayRecord ? todayRecord.healthScore : 85;

  // Color theme mapping
  const themeBgMap: Record<ColorTheme, string> = {
    default: 'bg-slate-950 text-slate-100',
    sage: 'bg-[#1a1d17] text-[#F7F2EB]',
    crimson: 'bg-[#180404] text-[#EEEAD7]',
    ocean: 'bg-[#081a24] text-[#FCE59A]',
    forest: 'bg-[#121612] text-[#EBE3A7]',
  };

  // Trigger sound effect on mood state change
  const triggerMoodEffects = (nextMood: MoodState) => {
    if (nextMood !== prevMoodRef.current) {
      soundEffects.playMoodSound(nextMood, settings.soundEnabled);

      if (settings.notificationsEnabled) {
        const quoteBank = GUILT_QUOTES[nextMood];
        if (quoteBank && quoteBank.length > 0) {
          const randomQuote = quoteBank[Math.floor(Math.random() * quoteBank.length)];
          setToast({
            id: Date.now().toString(),
            mood: nextMood,
            text: randomQuote,
            timestamp: Date.now(),
          });
        }
      }
      prevMoodRef.current = nextMood;
    }
  };

  // Sync state from Chrome extension storage or standalone ticker
  useEffect(() => {
    if (isExtensionEnvironment) {
      // 1. Initial State Fetch
      ExtensionStorage.getState().then((extState) => {
        setMood(extState.currentMood);
        setMetrics(extState.metrics);
        setCalmDurationMs(extState.calmDurationMs);
        if (extState.settings) setSettings(extState.settings);
        setHistory(StorageService.getHistory());
      });

      // 2. Listen to Chrome Storage changes in real-time
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes.typemood_ext_state && changes.typemood_ext_state.newValue) {
          const newState = changes.typemood_ext_state.newValue as ExtensionState;
          if (newState.currentMood) {
            setMood(newState.currentMood);
            triggerMoodEffects(newState.currentMood);
          }
          if (newState.metrics) setMetrics(newState.metrics);
          if (newState.calmDurationMs !== undefined) setCalmDurationMs(newState.calmDurationMs);
          if (newState.settings) setSettings(newState.settings);
          setHistory(StorageService.getHistory());
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    } else {
      // Standalone browser mode ticker
      const interval = setInterval(() => {
        const events = tracker.getEvents();
        const lastTs = tracker.getLastKeyTimestamp();
        const currentMetrics = MetricsCalculator.calculate(events, lastTs, 8000);
        setMetrics(currentMetrics);

        const nextMood = classifier.update(currentMetrics, settings.sensitivity);
        setMood(nextMood);
        setCalmDurationMs(classifier.getCalmDurationMs());

        if (currentMetrics.totalKeysInWindow > 0 || nextMood !== 'IDLE') {
          StorageService.recordMoodTick(nextMood, events.length > 0 ? 1 : 0, currentMetrics.wpm);
          setHistory(StorageService.getHistory());
        }

        triggerMoodEffects(nextMood);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [tracker, classifier, settings, isExtensionEnvironment]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    StorageService.saveSettings(updated);
    if (isExtensionEnvironment) {
      ExtensionStorage.setState({ settings: updated });
    }
  };

  const handleResetHistory = () => {
    localStorage.clear();
    const freshHistory = StorageService.generateDefaultSampleHistory();
    setHistory(freshHistory);
    setSettings(StorageService.getSettings());
    setSettingsOpen(false);
  };

  const currentThemeClass = themeBgMap[settings.theme || 'default'];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 overflow-y-auto ${currentThemeClass} ${mood === 'RAGE' ? 'animate-screenShake' : ''}`}>
      {/* Top Header Navbar */}
      <Header
        species={settings.currentSpecies}
        healthScore={currentHealth}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenSpecies={() => setSpeciesOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Virtual Plant Canvas */}
          <div className="lg:col-span-5 space-y-4">
            <PlantCanvas
              mood={mood}
              species={settings.currentSpecies}
              calmDurationMs={calmDurationMs}
            />

            {/* Quick Privacy Guarantee Box */}
            <div className="p-4 glass-panel rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Timing deltas only. Zero text log.</span>
                </div>
                <button
                  onClick={() => setPrivacyOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold underline text-[11px]"
                >
                  Pledge
                </button>
              </div>

              {isExtensionEnvironment && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-indigo-300 font-mono text-[11px]">
                  <span className="flex items-center space-x-1.5">
                    <Chrome className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Chrome Extension Active Across All Tabs</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Journal Editor / Extension Dashboard / Heatmap / Weather Report */}
          <div className="lg:col-span-7">
            {activeTab === 'editor' && (
              <TypingArea
                onKeyDown={tracker.handleKeyDown}
                metrics={metrics}
                onOpenPrivacyModal={() => setPrivacyOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <ExtensionDashboard
                metrics={metrics}
                currentMood={mood}
                onOpenPrivacyModal={() => setPrivacyOpen(true)}
              />
            )}

            {activeTab === 'analytics' && <MoodRingHeatmap history={history} />}

            {activeTab === 'weather' && <WeatherReport history={history} />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono shrink-0">
        TypeMood v0.1 • It's not you, it's your keyboard cadence. Zero keylogging.
      </footer>

      {/* Guilt Notification Toast */}
      <GuiltToast toast={toast} onDismiss={() => setToast(null)} />

      {/* Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <SpeciesModal
        isOpen={speciesOpen}
        onClose={() => setSpeciesOpen(false)}
        currentSpecies={settings.currentSpecies}
        unlockedSpecies={settings.unlockedSpecies}
        onSelectSpecies={(sp) => {
          handleUpdateSettings({ currentSpecies: sp });
          setSpeciesOpen(false);
        }}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetHistory={handleResetHistory}
      />
    </div>
  );
};

export default App;
