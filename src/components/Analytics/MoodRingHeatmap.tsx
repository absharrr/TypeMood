import React, { useState } from 'react';
import { DayRecord } from '../../types/typing';
import { Calendar } from 'lucide-react';

interface MoodRingHeatmapProps {
  history: Record<string, DayRecord>;
}

export const MoodRingHeatmap: React.FC<MoodRingHeatmapProps> = ({ history }) => {
  const [selectedDay, setSelectedDay] = useState<DayRecord | null>(null);

  const days = Object.values(history).sort((a, b) => a.date.localeCompare(b.date));

  // Color mapping based on health score & dominant mood
  const getTileColor = (record?: DayRecord) => {
    if (!record) return 'bg-slate-800 border-slate-700/50';

    switch (record.dominantMood) {
      case 'CALM':
        return record.healthScore > 80
          ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/20'
          : 'bg-emerald-600/80 border-emerald-500';
      case 'RECOVERING':
        return 'bg-teal-500 border-teal-400';
      case 'ERRATIC':
        return 'bg-amber-500 border-amber-400 shadow-sm shadow-amber-500/20';
      case 'RAGE':
        return 'bg-rose-500 border-rose-400 shadow-sm shadow-rose-500/20';
      case 'IDLE':
      default:
        return 'bg-slate-700 border-slate-600';
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100 text-base">Mood Rings — 30 Day Heatmap</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Click any day for details
        </div>
      </div>

      {/* Grid of 30 days */}
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-2 bg-slate-900/60 rounded-2xl border border-slate-800">
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(day)}
            className={`h-9 rounded-xl border transition-all transform hover:scale-110 flex flex-col items-center justify-center p-1 group relative ${getTileColor(day)}`}
            title={`${day.date}: ${day.dominantMood} (${day.healthScore}% health)`}
          >
            <span className="text-[10px] font-mono font-bold text-slate-100 drop-shadow-sm">
              {day.date.split('-')[2]}
            </span>
          </button>
        ))}
      </div>

      {/* Legend Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800">
        <span className="text-[11px]">Dominant Cadence:</span>
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Calm</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Erratic</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Rage</span>
          </span>
        </div>
      </div>

      {/* Detailed Day Breakdown Popover Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full space-y-4 border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h4 className="font-bold text-slate-100 text-lg">{selectedDay.date}</h4>
                <p className="text-xs text-slate-400 font-mono">Daily Mood Breakdown</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-slate-400 hover:text-slate-200 text-sm p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Health Score & Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Plant Health</div>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">{selectedDay.healthScore}%</div>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Avg Speed</div>
                <div className="text-xl font-bold text-indigo-400 mt-0.5">{selectedDay.wpmAverage} WPM</div>
              </div>
            </div>

            {/* Mood Distribution Progress Bars */}
            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Calm / Steady</span>
                  <span>{selectedDay.moodDistribution.CALM}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${selectedDay.moodDistribution.CALM}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Erratic / Anxious</span>
                  <span>{selectedDay.moodDistribution.ERRATIC}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${selectedDay.moodDistribution.ERRATIC}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rage / Bursts</span>
                  <span>{selectedDay.moodDistribution.RAGE}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${selectedDay.moodDistribution.RAGE}%` }}></div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold rounded-xl text-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
