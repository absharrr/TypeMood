import React from 'react';
import { ShieldCheck, Lock, EyeOff, Cpu, HardDrive } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 border border-emerald-500/30 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center space-x-3 text-emerald-400">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">Zero-Keylogging Privacy Pledge</h3>
            <p className="text-xs text-emerald-400 font-mono">It's not you, it's your keyboard cadence.</p>
          </div>
        </div>

        {/* Big Privacy Promise Box */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-slate-200 text-sm space-y-2">
          <p className="font-semibold text-emerald-300">
            "We only measure timing between keystrokes. We never see what you type."
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            TypeMood strictly records milliseconds between keypress events (`performance.now()`). Your typed letters, words, sentences, or document contents are never captured, logged, or saved anywhere.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">No Content Analysis</div>
              <div className="text-slate-400 text-[11px]">No NLP, sentiment analysis, or character code inspection.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">100% Local Engine</div>
              <div className="text-slate-400 text-[11px]">All metrics computed strictly client-side inside your browser.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
            <HardDrive className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Local Storage Only</div>
              <div className="text-slate-400 text-[11px]">Mood aggregates stay in LocalStorage/IndexedDB on your device.</div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start space-x-2.5">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Zero Server Sync</div>
              <div className="text-slate-400 text-[11px]">No user accounts, no cloud database, zero network payloads.</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold rounded-2xl text-sm transition-colors shadow-lg shadow-emerald-900/30"
        >
          Got It — Return to Journal
        </button>
      </div>
    </div>
  );
};
