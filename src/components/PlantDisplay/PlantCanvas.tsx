import React, { useEffect, useState } from 'react';
import { MoodState, PlantSpecies } from '../../types/typing';
import { FernPlant } from './FernPlant';
import { BonsaiPlant } from './BonsaiPlant';
import { CactusPlant } from './CactusPlant';

interface PlantCanvasProps {
  mood: MoodState;
  species: PlantSpecies;
  calmDurationMs: number;
}

export const PlantCanvas: React.FC<PlantCanvasProps> = ({ mood, species, calmDurationMs }) => {
  const [leafDropActive, setLeafDropActive] = useState(false);

  // Trigger flower blooming when calm duration exceeds 20 seconds
  const isBlooming = (mood === 'CALM' || mood === 'RECOVERING') && calmDurationMs > 18000;

  // Trigger leaf drop particle on entering RAGE mode
  useEffect(() => {
    if (mood === 'RAGE') {
      setLeafDropActive(true);
      const timer = setTimeout(() => setLeafDropActive(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [mood]);

  // Ambient aura glow styling based on mood
  const auraGlowMap: Record<MoodState, string> = {
    CALM: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    ERRATIC: 'from-amber-500/25 via-yellow-500/10 to-transparent',
    RAGE: 'from-rose-600/30 via-red-500/15 to-transparent',
    IDLE: 'from-indigo-500/15 via-blue-500/5 to-transparent',
    RECOVERING: 'from-sky-500/20 via-emerald-500/10 to-transparent',
  };

  const statusBadgeMap: Record<MoodState, { label: string; bg: string; text: string }> = {
    CALM: { label: 'Perked Up & Growing', bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-300' },
    ERRATIC: { label: 'Wilting & Distressed', bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-300' },
    RAGE: { label: 'Rage Shaking!', bg: 'bg-rose-500/20 border-rose-500/30', text: 'text-rose-300' },
    IDLE: { label: 'Napping... (zZZ)', bg: 'bg-indigo-500/20 border-indigo-500/30', text: 'text-indigo-300' },
    RECOVERING: { label: 'Healing Soil & Leaves', bg: 'bg-sky-500/20 border-sky-500/30', text: 'text-sky-300' },
  };

  const currentBadge = statusBadgeMap[mood];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 glass-panel rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
      {/* Background Radial Mood Glow */}
      <div
        className={`absolute inset-0 bg-radial-glow ${auraGlowMap[mood]} bg-gradient-to-t transition-opacity duration-700 pointer-events-none`}
      />

      {/* Floating zZZ animation overlay when Napping */}
      {mood === 'IDLE' && (
        <div className="absolute top-12 right-16 pointer-events-none flex flex-col items-center select-none">
          <span className="text-indigo-300 font-bold text-lg animate-floatZzz opacity-80" style={{ animationDelay: '0s' }}>z</span>
          <span className="text-indigo-300 font-bold text-xl animate-floatZzz opacity-90" style={{ animationDelay: '0.6s' }}>Z</span>
          <span className="text-indigo-200 font-extrabold text-2xl animate-floatZzz" style={{ animationDelay: '1.2s' }}>Z</span>
        </div>
      )}

      {/* Bloom Particle Sparkles */}
      {isBlooming && (
        <div className="absolute top-10 pointer-events-none flex space-x-12 animate-pulse">
          <span className="text-pink-300 text-sm">✨</span>
          <span className="text-amber-200 text-xs">🌸</span>
          <span className="text-pink-400 text-base">✨</span>
        </div>
      )}

      {/* Render Selected Species */}
      <div className="relative z-10 my-2">
        {species === 'BONSAI' ? (
          <BonsaiPlant mood={mood} isBlooming={isBlooming} leafDropActive={leafDropActive} />
        ) : species === 'CACTUS' ? (
          <CactusPlant mood={mood} isBlooming={isBlooming} leafDropActive={leafDropActive} />
        ) : (
          <FernPlant mood={mood} isBlooming={isBlooming} leafDropActive={leafDropActive} />
        )}
      </div>

      {/* Plant Companion Status Badge */}
      <div className={`mt-4 px-4 py-1.5 rounded-full border backdrop-blur-md text-xs font-semibold tracking-wide transition-all duration-500 ${currentBadge.bg} ${currentBadge.text} flex items-center space-x-2`}>
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mood === 'RAGE' ? 'bg-rose-400' : 'bg-emerald-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${mood === 'RAGE' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
        </span>
        <span>{currentBadge.label}</span>
      </div>
    </div>
  );
};
