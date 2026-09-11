import React from 'react';
import { UserSettings, ColorTheme } from '../../types/typing';
import { Settings, Volume2, VolumeX, Bell, BellOff, Sliders, Trash2, Palette, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onResetHistory: () => void;
}

interface PaletteOption {
  id: ColorTheme;
  name: string;
  colors: string[];
}

const PALETTES: PaletteOption[] = [
  {
    id: 'default',
    name: 'Emerald Dark',
    colors: ['#0f172a', '#10b981', '#34d399', '#020617'],
  },
  {
    id: 'sage',
    name: 'Sage & Cream',
    colors: ['#8B9A6E', '#F7F2EB', '#EAE2D6', '#EEEEEE'],
  },
  {
    id: 'crimson',
    name: 'Crimson Mahogany',
    colors: ['#6D0808', '#2D0000', '#757D6F', '#EEEAD7'],
  },
  {
    id: 'ocean',
    name: 'Ocean & Sunshine',
    colors: ['#218DAE', '#2BBBD7', '#FCE59A', '#FFD758'],
  },
  {
    id: 'forest',
    name: 'Forest Terracotta',
    colors: ['#2C5745', '#EB7D00', '#2E2910', '#EBE3A7'],
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 border border-slate-700 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-100">TypeMood Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded-lg">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs font-sans">
          {/* Color Theme Selector */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-bold">
              <Palette className="w-4 h-4 text-emerald-400" />
              <span>Color Palette Themes</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Select your favorite aesthetic color palette:
            </div>
            <div className="space-y-2 pt-1">
              {PALETTES.map((p) => {
                const isSelected = settings.theme === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onUpdateSettings({ theme: p.id })}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        {p.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-slate-200 text-xs">{p.name}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.notificationsEnabled ? (
                <Bell className="w-5 h-5 text-emerald-400" />
              ) : (
                <BellOff className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <div className="font-bold text-slate-200">Guilt Notifications</div>
                <div className="text-slate-400 text-[11px]">Humorous feedback toasts during typing shifts</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-indigo-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-500" />
              )}
              <div>
                <div className="font-bold text-slate-200">Ambient Sound Cues</div>
                <div className="text-slate-400 text-[11px]">Soft audio chimes during bloom or rage states</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sensitivity Calibration */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-slate-200 font-bold">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Rhythm Sensitivity Calibration</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Adjust how sensitive plant reaction thresholds are:
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['low', 'medium', 'high'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateSettings({ sensitivity: s })}
                  className={`py-2 rounded-xl text-xs font-mono font-bold capitalize transition-all ${
                    settings.sensitivity === s
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Local Data */}
          <div className="pt-2">
            <button
              onClick={onResetHistory}
              className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset 30-Day Local Mood History</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};
