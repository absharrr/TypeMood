import React, { useRef, useState } from 'react';
import { DayRecord, WeatherMetaphor } from '../../types/typing';
import { CloudSun, Download, Copy, Check } from 'lucide-react';

interface WeatherReportProps {
  history: Record<string, DayRecord>;
}

export const WeatherReport: React.FC<WeatherReportProps> = ({ history }) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const days = Object.values(history);

  // Aggregate mood counts across the week
  let totalCalm = 0;
  let totalErratic = 0;
  let totalRage = 0;
  let totalIdle = 0;

  days.forEach((d) => {
    totalCalm += d.moodDistribution.CALM + (d.moodDistribution.RECOVERING || 0);
    totalErratic += d.moodDistribution.ERRATIC;
    totalRage += d.moodDistribution.RAGE;
    totalIdle += d.moodDistribution.IDLE;
  });

  const grandTotal = Math.max(1, totalCalm + totalErratic + totalRage + totalIdle);

  const serenePct = Math.round((totalCalm / grandTotal) * 100);
  const thunderstormPct = Math.round((totalErratic / grandTotal) * 100);
  const stormWarningPct = Math.round((totalRage / grandTotal) * 100);
  const foggyPct = Math.round((totalIdle / grandTotal) * 100);

  // Determine dominant weather metaphor
  let dominantWeather: WeatherMetaphor = 'SERENE';
  let headline = 'Mostly Serene & Sunny ☀️';

  if (stormWarningPct > 25) {
    dominantWeather = 'STORM_WARNING';
    headline = 'Severe Storm Warning 🌪️';
  } else if (thunderstormPct > 35) {
    dominantWeather = 'THUNDERSTORM';
    headline = 'Scattered Thunderstorms 🌩️';
  } else if (serenePct > 55) {
    dominantWeather = 'SERENE';
    headline = 'Serene & Sunny Skies ☀️';
  } else {
    dominantWeather = 'PARTLY_CLOUDY';
    headline = 'Partly Cloudy & Breeze ⛅';
  }

  const summaryText = `🌿 TypeMood Weekly Weather Report:\n- ${serenePct}% Serene ☀️\n- ${thunderstormPct}% Thunderstorms 🌩️\n- ${stormWarningPct}% Storm Warnings 🌪️\n- ${foggyPct}% Foggy 🌫️\nDominant Weather: ${headline}\n"It's not you, it's your keyboard cadence." Zero keylogging guaranteed!`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw stylized weather card on canvas
    canvas.width = 600;
    canvas.height = 400;

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 600, 400);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 400);

    // Decorative Card Border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 570, 370);

    // Header Logo & Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🌿 TypeMood Weather Report', 45, 60);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Weekly Keyboard Cadence Summary', 45, 85);

    // Headline Box
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(45, 110, 510, 65);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 110, 510, 65);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(headline, 65, 150);

    // Weather Metrics Breakdown
    const drawBar = (label: string, percentage: number, color: string, y: number) => {
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '14px monospace';
      ctx.fillText(`${label} (${percentage}%)`, 45, y);

      // Track
      ctx.fillStyle = '#334155';
      ctx.fillRect(220, y - 12, 335, 14);

      // Fill
      ctx.fillStyle = color;
      ctx.fillRect(220, y - 12, (335 * percentage) / 100, 14);
    };

    drawBar('Serene ☀️', serenePct, '#10b981', 210);
    drawBar('Thunderstorm 🌩️', thunderstormPct, '#f59e0b', 245);
    drawBar('Storm Warning 🌪️', stormWarningPct, '#ef4444', 280);
    drawBar('Foggy 🌫️', foggyPct, '#6366f1', 315);

    // Footer Guarantee
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 12px sans-serif';
    ctx.fillText('🔒 Measured strictly via keystroke timing deltas • Zero content keylogging', 45, 360);

    // Download PNG
    const link = document.createElement('a');
    link.download = `TypeMood-Weather-Report-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      {/* Hidden Canvas for Image Export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CloudSun className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold text-slate-100 text-base">Weekly Typing Weather Report</h3>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-mono">
          {dominantWeather}
        </span>
      </div>

      {/* Weather Headline Card */}
      <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Weekly Outlook</div>
          <div className="text-lg font-bold text-slate-100 mt-1">{headline}</div>
        </div>
        <div className="text-4xl select-none">
          {serenePct > 50 ? '☀️' : stormWarningPct > 20 ? '🌪️' : '⛅'}
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-3 font-mono text-xs">
        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>☀️ Serene (Calm & Steady)</span>
            <span>{serenePct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${serenePct}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>🌩️ Thunderstorm (Anxious / Erratic)</span>
            <span>{thunderstormPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: `${thunderstormPct}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>🌪️ Storm Warning (Rage Typing)</span>
            <span>{stormWarningPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-700" style={{ width: `${stormWarningPct}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-slate-300 mb-1">
            <span>🌫️ Foggy (Idle / Napping)</span>
            <span>{foggyPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${foggyPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Sharing Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center space-x-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-900/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Card (.png)</span>
        </button>

        <button
          onClick={handleCopyText}
          className="flex items-center justify-center space-x-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Summary!' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};
