import React, { useState } from 'react';
import { RollingMetrics } from '../../types/typing';
import { LiveMetricsBar } from './LiveMetricsBar';
import { RefreshCw, Sparkles, Lock } from 'lucide-react';

interface TypingAreaProps {
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  metrics: RollingMetrics;
  onOpenPrivacyModal: () => void;
}

const PROMPT_SUGGESTIONS = [
  "Write down what's on your mind today...",
  "Draft an email to your future self about your current goals...",
  "Describe your perfect calm afternoon in vivid detail...",
  "What is something frustrating you solved recently?",
];

export const TypingArea: React.FC<TypingAreaProps> = ({ onKeyDown, metrics, onOpenPrivacyModal }) => {
  const [text, setText] = useState<string>('');
  const [promptIndex, setPromptIndex] = useState<number>(0);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Editor Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-800/80 p-3 px-4 rounded-2xl border border-slate-700/60">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="italic text-slate-400">"{PROMPT_SUGGESTIONS[promptIndex]}"</span>
          <button
            onClick={handleNextPrompt}
            className="p-1 hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
            title="Next writing prompt"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Privacy Lock Badge */}
        <button
          onClick={onOpenPrivacyModal}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-medium transition-all shrink-0 self-start sm:self-auto"
        >
          <Lock className="w-3 h-3" />
          <span>Timing Only • Zero Keylogging</span>
        </button>
      </div>

      {/* Main Scoped Writing Pad */}
      <div className="relative flex-1 glass-panel rounded-2xl p-4 flex flex-col focus-within:ring-2 focus-within:ring-emerald-500/50 transition-all">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Start typing here... watch your plant react to your rhythm, speed, and corrections in real-time."
          className="w-full h-64 sm:h-80 bg-transparent text-slate-100 placeholder-slate-500 resize-none outline-none font-sans text-base sm:text-lg leading-relaxed selection:bg-emerald-500/30"
          autoFocus
        />

        {/* Text Area Footer Info */}
        <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-4">
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
          </div>

          {text.length > 0 && (
            <button
              onClick={handleClear}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear Editor
            </button>
          )}
        </div>
      </div>

      {/* Live Cadence Metrics Bar */}
      <LiveMetricsBar metrics={metrics} />
    </div>
  );
};
