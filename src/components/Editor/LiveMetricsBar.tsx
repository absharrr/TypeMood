import React from 'react';
import { RollingMetrics } from '../../types/typing';
import { Activity, Gauge, Delete, Zap } from 'lucide-react';

interface LiveMetricsBarProps {
  metrics: RollingMetrics;
}

export const LiveMetricsBar: React.FC<LiveMetricsBarProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
      {/* WPM Card */}
      <div className="glass-panel p-3 rounded-xl flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
          <Gauge className="w-4 h-4" />
        </div>
        <div>
          <div className="text-slate-400 text-[10px] font-sans uppercase tracking-wider">Speed (Est)</div>
          <div className="text-slate-100 font-bold text-sm">{metrics.wpm} <span className="text-[10px] font-normal text-slate-400">WPM</span></div>
        </div>
      </div>

      {/* Rhythm Jitter / IKI Variance Card */}
      <div className="glass-panel p-3 rounded-xl flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <div className="text-slate-400 text-[10px] font-sans uppercase tracking-wider">Rhythm Jitter</div>
          <div className="text-slate-100 font-bold text-sm">{metrics.ikiVariance} <span className="text-[10px] font-normal text-slate-400">ms std</span></div>
        </div>
      </div>

      {/* Backspace Rate Card */}
      <div className="glass-panel p-3 rounded-xl flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
          <Delete className="w-4 h-4" />
        </div>
        <div>
          <div className="text-slate-400 text-[10px] font-sans uppercase tracking-wider">Corrections</div>
          <div className="text-slate-100 font-bold text-sm">{Math.round(metrics.backspaceRatio * 100)}% <span className="text-[10px] font-normal text-slate-400">ratio</span></div>
        </div>
      </div>

      {/* Burst Counter Card */}
      <div className="glass-panel p-3 rounded-xl flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <div className="text-slate-400 text-[10px] font-sans uppercase tracking-wider">Burst Spikes</div>
          <div className="text-slate-100 font-bold text-sm">{metrics.burstCount} <span className="text-[10px] font-normal text-slate-400">bursts</span></div>
        </div>
      </div>
    </div>
  );
};
