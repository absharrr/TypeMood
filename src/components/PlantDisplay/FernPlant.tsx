import React from 'react';
import { MoodState } from '../../types/typing';

interface PlantProps {
  mood: MoodState;
  isBlooming: boolean;
  leafDropActive: boolean;
}

export const FernPlant: React.FC<PlantProps> = ({ mood, isBlooming, leafDropActive }) => {
  const isDrooping = mood === 'ERRATIC';
  const isRage = mood === 'RAGE';
  const isShaking = mood === 'RAGE';
  const isNapping = mood === 'IDLE';

  // Rotation angles for leaves based on mood
  const leftAngle = isRage ? -50 : isDrooping ? -40 : isNapping ? -25 : -15;
  const rightAngle = isRage ? 50 : isDrooping ? 40 : isNapping ? 25 : 15;
  const centerScale = isRage ? 1.1 : isDrooping ? 0.85 : isBlooming ? 1.15 : 1;

  return (
    <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-700 ${isShaking ? 'animate-shake' : ''}`}>
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isRage ? "#7f1d1d" : "#e2e8f0"} />
            <stop offset="100%" stopColor={isRage ? "#450a0a" : "#94a3b8"} />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="leafWiltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="leafRageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          <linearGradient id="soilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Soil Base */}
        <ellipse cx="120" cy="180" rx="55" ry="12" fill="url(#soilGrad)" />

        {/* Soil Cracks (Visible during Erratic & Rage) */}
        {(isDrooping || isRage) && (
          <g stroke={isRage ? "#ef4444" : "#1c1917"} strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
            <path d="M 95 180 L 110 183 L 118 178" />
            <path d="M 125 180 L 135 184 L 145 179" />
            <path d="M 115 182 L 120 188 L 128 185" />
          </g>
        )}

        {/* Plant Pot */}
        <path
          d="M 70 178 L 80 220 C 80 226 160 226 160 220 L 170 178 Z"
          fill="url(#potGrad)"
          stroke={isRage ? "#ef4444" : "#64748b"}
          strokeWidth="3"
        />
        {/* Pot Rim */}
        <rect x="65" y="170" width="110" height="12" rx="4" fill={isRage ? "#b91c1c" : "#cbd5e1"} stroke={isRage ? "#ef4444" : "#64748b"} strokeWidth="3" />

        {/* Plant Stems & Leaves Group */}
        <g transform={`translate(120, 172) scale(${centerScale})`} className="transition-transform duration-500">
          {/* Main Stem */}
          <path
            d={`M 0 0 C ${isDrooping || isRage ? '15 -40, -20 -80' : '0 -40, 0 -110'}`}
            fill="none"
            stroke={isRage ? "#991b1b" : "#059669"}
            strokeWidth="5"
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {/* Left Branch */}
          <g transform={`rotate(${leftAngle})`} className="transition-transform duration-500 origin-bottom">
            <path d="M 0 0 C -20 -30, -50 -50, -65 -70" fill="none" stroke={isRage ? "#991b1b" : "#059669"} strokeWidth="4" />
            <path
              d="M -65 -70 Q -45 -90 -25 -70 Q -45 -50 -65 -70"
              fill={isRage ? "url(#leafRageGrad)" : isDrooping ? "url(#leafWiltGrad)" : "url(#leafGrad)"}
              className="transition-colors duration-500"
            />
            <path
              d="M -40 -40 Q -20 -60 0 -40 Q -20 -20 -40 -40"
              fill={isRage ? "url(#leafRageGrad)" : isDrooping ? "url(#leafWiltGrad)" : "url(#leafGrad)"}
              className="transition-colors duration-500"
            />
          </g>

          {/* Right Branch */}
          <g transform={`rotate(${rightAngle})`} className="transition-transform duration-500 origin-bottom">
            <path d="M 0 0 C 20 -30, 50 -50, 65 -70" fill="none" stroke={isRage ? "#991b1b" : "#059669"} strokeWidth="4" />
            <path
              d="M 65 -70 Q 45 -90 25 -70 Q 45 -50 65 -70"
              fill={isRage ? "url(#leafRageGrad)" : isDrooping ? "url(#leafWiltGrad)" : "url(#leafGrad)"}
              className="transition-colors duration-500"
            />
            <path
              d="M 40 -40 Q 20 -60 0 -40 Q 20 -20 40 -40"
              fill={isRage ? "url(#leafRageGrad)" : isDrooping ? "url(#leafWiltGrad)" : "url(#leafGrad)"}
              className="transition-colors duration-500"
            />
          </g>

          {/* Center Crown Leaf */}
          <path
            d={`M 0 -70 Q ${isDrooping || isRage ? '-30 -100 0 -100' : '0 -130 0 -120'} Q ${isDrooping || isRage ? '30 -100 0 -70' : '0 -100 0 -70'}`}
            fill={isRage ? "url(#leafRageGrad)" : isDrooping ? "url(#leafWiltGrad)" : "url(#leafGrad)"}
            className="transition-all duration-500"
          />

          {/* RAGE MODE: Billowing Smoke Clouds Floating from Plant Head */}
          {isRage && (
            <g transform="translate(0, -115)">
              <circle cx="-12" cy="0" r="14" fill="rgba(239, 68, 68, 0.85)" className="animate-rageSmoke" style={{ animationDelay: '0s' }} />
              <circle cx="10" cy="-5" r="16" fill="rgba(185, 28, 28, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '0.3s' }} />
              <circle cx="0" cy="-12" r="18" fill="rgba(156, 163, 175, 0.8)" className="animate-rageSmoke" style={{ animationDelay: '0.6s' }} />
              <circle cx="-8" cy="-20" r="15" fill="rgba(239, 68, 68, 0.6)" className="animate-rageSmoke" style={{ animationDelay: '0.9s' }} />
              <circle cx="12" cy="-25" r="20" fill="rgba(75, 85, 99, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '1.2s' }} />
            </g>
          )}

          {/* Flowers when Blooming! */}
          {isBlooming && !isRage && (
            <g className="animate-bloom">
              <g transform="translate(-25, -75) scale(0.9)">
                <circle cx="0" cy="-6" r="7" fill="#f472b6" />
                <circle cx="-6" cy="0" r="7" fill="#f472b6" />
                <circle cx="6" cy="0" r="7" fill="#f472b6" />
                <circle cx="0" cy="6" r="7" fill="#f472b6" />
                <circle cx="0" cy="0" r="5" fill="#fde047" />
              </g>
              <g transform="translate(25, -75) scale(0.9)">
                <circle cx="0" cy="-6" r="7" fill="#fb7185" />
                <circle cx="-6" cy="0" r="7" fill="#fb7185" />
                <circle cx="6" cy="0" r="7" fill="#fb7185" />
                <circle cx="0" cy="6" r="7" fill="#fb7185" />
                <circle cx="0" cy="0" r="5" fill="#fde047" />
              </g>
            </g>
          )}

          {/* Falling Leaf Effect during Rage */}
          {leafDropActive && (
            <path
              d="M -30 -30 Q -50 -50 -20 -50 Z"
              fill="#ef4444"
              className="animate-leafDrop"
            />
          )}
        </g>

        {/* Cute Expressive Eyes on Pot */}
        <g transform="translate(120, 198)">
          {isNapping ? (
            <g stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M -16 -2 Q -10 4 -4 -2" />
              <path d="M 4 -2 Q 10 4 16 -2" />
            </g>
          ) : isRage ? (
            /* Fiery Angry Eyes & Eyebrows */
            <g fill="#ef4444">
              <circle cx="-10" cy="0" r="4.5" />
              <circle cx="10" cy="0" r="4.5" />
              <path d="M -16 -8 L -4 -2" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <path d="M 16 -8 L 4 -2" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
              <ellipse cx="0" cy="6" rx="4" ry="3" fill="#991b1b" stroke="#ef4444" strokeWidth="1.5" />
            </g>
          ) : isDrooping ? (
            <g fill="#334155">
              <ellipse cx="-10" cy="0" rx="3.5" ry="4.5" />
              <ellipse cx="10" cy="0" rx="3.5" ry="4.5" />
              <path d="M -15 -8 L -6 -4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <path d="M 15 -8 L 6 -4" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="0" cy="8" rx="3" ry="2" fill="none" stroke="#334155" strokeWidth="2" />
            </g>
          ) : (
            <g fill="#1e293b">
              <circle cx="-10" cy="0" r="4" />
              <circle cx="10" cy="0" r="4" />
              <circle cx="-8.5" cy="-1.5" r="1.5" fill="#ffffff" />
              <circle cx="11.5" cy="-1.5" r="1.5" fill="#ffffff" />
              <path d="M -6 4 Q 0 9 6 4" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
