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
  currentMood,
  onOpenPrivacyModal,
}) => {
  const [selectedMood, setSelectedMood] = React.useState<MoodState | null>(null);

  // Active sound mood defaults to current live mood or last clicked test sound
  const activeSoundMood = selectedMood || currentMood;

  const playSoundTest = (targetMood: MoodState) => {
    setSelectedMood(targetMood);
    soundEffects.playMoodSound(targetMood, true);
  };

  const soundOptions: Array<{
    id: MoodState;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    activeBorder: string;
    activeBg: string;
    badgeColor: string;
  }> = [
    {
      id: 'CALM',
      title: '🌸 Bloom Chime',
      subtitle: 'Calm / Steady',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'text-emerald-300',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-400/80 shadow-emerald-900/50',
      activeBg: 'bg-emerald-500/25',
      badgeColor: 'bg-emerald-400 text-slate-950',
    },
    {
      id: 'ERRATIC',
      title: '🥀 Wobble Pitch',
      subtitle: 'Erratic / Jitter',
      icon: <Volume2 className="w-3.5 h-3.5 text-amber-400" />,
      color: 'text-amber-300',
      activeBorder: 'border-amber-400 ring-2 ring-amber-400/80 shadow-amber-900/50',
      activeBg: 'bg-amber-500/25',
      badgeColor: 'bg-amber-400 text-slate-950',
    },
    {
      id: 'RAGE',
      title: '🌋 Bass Rumble',
      subtitle: 'Rage Burst',
      icon: <Zap className="w-3.5 h-3.5 text-rose-400" />,
      color: 'text-rose-300',
      activeBorder: 'border-rose-400 ring-2 ring-rose-400/80 shadow-rose-900/50',
      activeBg: 'bg-rose-500/25',
      badgeColor: 'bg-rose-400 text-slate-950',
    },
    {
      id: 'IDLE',
      title: '💤 Nap Lullaby',
      subtitle: 'Idle / Sleeping',
      icon: <Volume2 className="w-3.5 h-3.5 text-indigo-400" />,
      color: 'text-indigo-300',
      activeBorder: 'border-indigo-400 ring-2 ring-indigo-400/80 shadow-indigo-900/50',
      activeBg: 'bg-indigo-500/25',
      badgeColor: 'bg-indigo-400 text-slate-950',
    },
    {
      id: 'RECOVERING',
      title: '🌱 Heal Chord',
      subtitle: 'Recovering',
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
      color: 'text-sky-300',
      activeBorder: 'border-sky-400 ring-2 ring-sky-400/80 shadow-sky-900/50',
      activeBg: 'bg-sky-500/25',
      badgeColor: 'bg-sky-400 text-slate-950',
    },
  ];

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
            <Volume2 className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Mood Audio Soundboard & Selection</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Active sound highlights live</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {soundOptions.map((opt) => {
            const isHighlighted = activeSoundMood === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => playSoundTest(opt.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-300 relative group flex flex-col justify-between border ${
                  isHighlighted
                    ? `${opt.activeBg} ${opt.activeBorder} shadow-lg scale-[1.02]`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-bold ${opt.color}`}>{opt.title}</span>
                  <div className="group-hover:scale-125 transition-transform">{opt.icon}</div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] text-slate-400 font-mono">{opt.subtitle}</span>
                  {isHighlighted && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${opt.badgeColor}`}>
                      🔊 Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
