import React from 'react';
import { PlantSpecies } from '../types/typing';
import { ShieldCheck, Sprout, Settings, Calendar, CloudSun, HeartPulse, ExternalLink, Download } from 'lucide-react';

interface HeaderProps {
  species: PlantSpecies;
  healthScore: number;
  onOpenPrivacy: () => void;
  onOpenSpecies: () => void;
  onOpenSettings: () => void;
  activeTab: 'editor' | 'dashboard' | 'analytics' | 'weather';
  setActiveTab: (tab: 'editor' | 'dashboard' | 'analytics' | 'weather') => void;
}

export const Header: React.FC<HeaderProps> = ({
  species,
  healthScore,
  onOpenPrivacy,
  onOpenSpecies,
  onOpenSettings,
  activeTab,
  setActiveTab,
}) => {
  const speciesEmojiMap: Record<PlantSpecies, string> = {
    FERN: '🌿 Fern',
    BONSAI: '🪴 Bonsai',
    CACTUS: '🌵 Cactus',
    GOLDEN_BLOSSOM: '✨ Blossom',
  };

  const handleOpenBigWindow = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'index.html' });
    } else {
      window.open(window.location.href, '_blank');
    }
  };

  return (
    <header className="w-full glass-panel border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-950/40 select-none">
            🌿
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-2">
              <span>TypeMood</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-normal">
                v0.1 Prototype
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">"It's not you, it's your keyboard cadence."</p>
          </div>
        </div>

        {/* Status Pills & Navigation Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-1">
          {/* Download Extension (.zip) Button */}
          <a
            href="/typemood-extension.zip"
            download="typemood-extension.zip"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 rounded-full font-bold text-xs shadow-md shadow-emerald-950/40 transition-all shrink-0"
            title="Download Chrome Extension (.zip) to install in Chrome"
          >
            <Download className="w-3.5 h-3.5 text-slate-950" />
            <span>Download Extension (.zip)</span>
          </a>

          {/* Open Big Window Button */}
          <button
            onClick={handleOpenBigWindow}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 text-xs font-bold transition-all shrink-0 shadow-sm"
            title="Open TypeMood in a big standalone desktop browser window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Big Window ↗</span>
          </button>

          {/* Plant Health Pill */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/90 rounded-full border border-slate-700 text-xs font-mono shrink-0">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-slate-300">Health:</span>
            <span className="font-bold text-emerald-400">{healthScore}%</span>
          </div>

          {/* Plant Species Switch Button */}
          <button
            onClick={onOpenSpecies}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 rounded-full border border-slate-700 text-xs font-medium transition-colors shrink-0"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>{speciesEmojiMap[species]}</span>
          </button>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900/90 p-1 rounded-full border border-slate-800 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'editor'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Journal
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monitor
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                activeTab === 'analytics'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Heatmap</span>
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-3 py-1 rounded-full transition-all flex items-center space-x-1 ${
                activeTab === 'weather'
                  ? 'bg-emerald-600 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudSun className="w-3 h-3" />
              <span>Report</span>
            </button>
          </div>

          {/* Privacy Button */}
          <button
            onClick={onOpenPrivacy}
            className="p-2 bg-slate-800/90 hover:bg-slate-700 text-emerald-400 rounded-full border border-slate-700 transition-colors shrink-0"
            title="Zero-Keylogging Privacy Guarantee"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-colors shrink-0"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
