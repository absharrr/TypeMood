import React, { useEffect } from 'react';
import { GuiltToastMessage } from '../../types/typing';
import { Sparkles, AlertCircle, Zap, Moon, HeartHandshake, X } from 'lucide-react';

interface GuiltToastProps {
  toast: GuiltToastMessage | null;
  onDismiss: () => void;
}

export const GuiltToast: React.FC<GuiltToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  const iconMap = {
    CALM: <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />,
    ERRATIC: <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />,
    RAGE: <Zap className="w-5 h-5 text-rose-400 shrink-0" />,
    IDLE: <Moon className="w-5 h-5 text-indigo-400 shrink-0" />,
    RECOVERING: <HeartHandshake className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const borderMap = {
    CALM: 'border-emerald-500/40 bg-emerald-950/80',
    ERRATIC: 'border-amber-500/40 bg-amber-950/80',
    RAGE: 'border-rose-500/40 bg-rose-950/80',
    IDLE: 'border-indigo-500/40 bg-indigo-950/80',
    RECOVERING: 'border-sky-500/40 bg-sky-950/80',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start space-x-3 text-slate-100 ${borderMap[toast.mood]}`}>
        {iconMap[toast.mood]}
        <div className="flex-1 pr-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Plant Companion Says:</div>
          <p className="text-xs font-medium leading-relaxed text-slate-100 mt-0.5">{toast.text}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
