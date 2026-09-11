import React from 'react';
import { RollingMetrics, MoodState } from '../../types/typing';
import { LiveMetricsBar } from './LiveMetricsBar';
import { soundEffects } from '../../engine/SoundEffectsService';
import { Chrome, Volume2, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

interface ExtensionDashboardProps {
  metrics: RollingMetrics;
  currentMood: MoodState;
  onOpenPrivacyModal: () => void;
}

export const ExtensionDashboard: React.FC<ExtensionDashboardProps> = ({
  metrics,
  onOpenPrivacyModal,
}) => {
  const playSoundTest = (mood: MoodState) => {
    soundEffects.playMoodSound(mood, true);
  };

  return (
    <div className="flex flex-col space-y-5">
      {/* Live Cross-Tab Status Card */}
      <div className="glass-panel p-5 rounded-3xl border border-indigo-500/30 space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold">
            <Chrome className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Universal Browser Monitor</span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
            Active Across All Tabs
          </span>
        </div>

        <div>
          <h3 className="font-bold text-slate-100 text-lg">Listening to Keyboard Cadence</h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Type anywhere in Chrome (Gmail, Google Docs, Notion, Slack, Twitter/X) and watch your plant companion react in real-time.
          </p>
        </div>

        <button
          onClick={onOpenPrivacyModal}
          className="flex items-center space-x-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors pt-1"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Zero-Keylogging Privacy Pledge</span>
        </button>
      </div>

      {/* Live Cadence Metrics HUD */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 px-1">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Cadence Telemetry</span>
        </div>
        <LiveMetricsBar metrics={metrics} />
      </div>

      {/* Fun Mood Soundboard / Audio Tester */}
      <div className="glass-panel p-5 rounded-3xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-200 font-bold text-sm">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Mood Audio Soundboard</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Click to test sounds</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            onClick={() => playSoundTest('CALM')}
            className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-left transition-all group"
          >
            <div className="text-xs font-bold text-emerald-300 flex items-center justify-between">
              <span>🌸 Bloom Chime</span>
              <Sparkles className="w-3 h-3 text-emerald-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Calm / Steady</div>
          </button>

          <button
            onClick={() => playSoundTest('ERRATIC')}
            className="p-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-2xl text-left transition-all group"
          >
            <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>🥀 Wobble Pitch</span>
              <Volume2 className="w-3 h-3 text-amber-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Erratic / Jitter</div>
          </button>

          <button
            onClick={() => playSoundTest('RAGE')}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl text-left transition-all group"
          >
            <div className="text-xs font-bold text-rose-300 flex items-center justify-between">
              <span>🌋 Bass Rumble</span>
              <Zap className="w-3 h-3 text-rose-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Rage Burst</div>
          </button>

          <button
            onClick={() => playSoundTest('IDLE')}
            className="p-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-left transition-all group"
          >
            <div className="text-xs font-bold text-indigo-300 flex items-center justify-between">
              <span>💤 Nap Lullaby</span>
              <Volume2 className="w-3 h-3 text-indigo-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Idle / Sleeping</div>
          </button>

          <button
            onClick={() => playSoundTest('RECOVERING')}
            className="p-2.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-2xl text-left transition-all group"
          >
            <div className="text-xs font-bold text-sky-300 flex items-center justify-between">
              <span>🌱 Heal Chord</span>
              <Sparkles className="w-3 h-3 text-sky-400 group-hover:scale-125 transition-transform" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Recovering</div>
          </button>
        </div>
      </div>
    </div>
  );
};
