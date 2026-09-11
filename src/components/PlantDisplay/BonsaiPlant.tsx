import React from 'react';
import { MoodState } from '../../types/typing';

interface PlantProps {
  mood: MoodState;
  isBlooming: boolean;
  leafDropActive: boolean;
}

export const BonsaiPlant: React.FC<PlantProps> = ({ mood, isBlooming, leafDropActive }) => {
  const isDrooping = mood === 'ERRATIC';
  const isRage = mood === 'RAGE';
  const isShaking = mood === 'RAGE';
  const isNapping = mood === 'IDLE';

  const foliageFill = isRage ? "url(#bonsaiFoliageRage)" : isDrooping ? "url(#bonsaiFoliageWilt)" : "url(#bonsaiFoliage)";

  return (
    <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-700 ${isShaking ? 'animate-shake' : ''}`}>
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="bonsaiPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isRage ? "#7f1d1d" : "#475569"} />
            <stop offset="100%" stopColor={isRage ? "#450a0a" : "#1e293b"} />
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isRage ? "#991b1b" : "#78350f"} />
            <stop offset="100%" stopColor={isRage ? "#450a0a" : "#451a03"} />
          </linearGradient>
          <linearGradient id="bonsaiFoliage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="bonsaiFoliageWilt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="bonsaiFoliageRage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>

        {/* Low Ceramic Bonsai Dish */}
        <ellipse cx="120" cy="205" rx="75" ry="14" fill="url(#bonsaiPotGrad)" stroke={isRage ? "#ef4444" : "#64748b"} strokeWidth="3" />
        <ellipse cx="120" cy="198" rx="73" ry="10" fill={isRage ? "#450a0a" : "#334155"} />

        {/* Zen Stones beside dish */}
        <ellipse cx="45" cy="208" rx="8" ry="4" fill={isRage ? "#ef4444" : "#94a3b8"} />
        <ellipse cx="195" cy="209" rx="10" ry="5" fill={isRage ? "#991b1b" : "#64748b"} />

        {/* Gnarled Bonsai Trunk */}
        <path
          d="M 120 198 C 110 170, 70 160, 90 120 C 100 100, 130 90, 120 65"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Branch Splitting Left */}
        <path
          d="M 90 120 C 70 110, 50 115, 45 105"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Branch Splitting Right */}
        <path
          d="M 115 95 C 140 85, 175 90, 180 80"
          fill="none"
          stroke="url(#trunkGrad)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Cloud-like Bonsai Foliage Clusters */}
        {/* Left Cluster */}
        <g transform={`translate(${isDrooping || isRage ? '45, 115' : '45, 100'})`} className="transition-transform duration-700">
          <circle cx="0" cy="0" r="28" fill={foliageFill} />
          <circle cx="-16" cy="6" r="20" fill={foliageFill} />
          <circle cx="16" cy="6" r="20" fill={foliageFill} />
        </g>

        {/* Right Cluster */}
        <g transform={`translate(${isDrooping || isRage ? '180, 90' : '180, 75'})`} className="transition-transform duration-700">
          <circle cx="0" cy="0" r="26" fill={foliageFill} />
          <circle cx="-14" cy="5" r="18" fill={foliageFill} />
          <circle cx="14" cy="5" r="18" fill={foliageFill} />
        </g>

        {/* Top Center Crown Cluster */}
        <g transform={`translate(${isDrooping || isRage ? '120, 75' : '120, 55'})`} className="transition-transform duration-700">
          <circle cx="0" cy="0" r="36" fill={foliageFill} />
          <circle cx="-22" cy="8" r="24" fill={foliageFill} />
          <circle cx="22" cy="8" r="24" fill={foliageFill} />

          {/* RAGE MODE: Billowing Smoke Clouds Floating from Head */}
          {isRage && (
            <g transform="translate(0, -35)">
              <circle cx="-12" cy="0" r="14" fill="rgba(239, 68, 68, 0.85)" className="animate-rageSmoke" style={{ animationDelay: '0s' }} />
              <circle cx="10" cy="-5" r="16" fill="rgba(185, 28, 28, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '0.3s' }} />
              <circle cx="0" cy="-12" r="18" fill="rgba(156, 163, 175, 0.8)" className="animate-rageSmoke" style={{ animationDelay: '0.6s' }} />
              <circle cx="-8" cy="-20" r="15" fill="rgba(239, 68, 68, 0.6)" className="animate-rageSmoke" style={{ animationDelay: '0.9s' }} />
              <circle cx="12" cy="-25" r="20" fill="rgba(75, 85, 99, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '1.2s' }} />
            </g>
          )}

          {/* Sakura Petal Blooming */}
          {(isBlooming || mood === 'CALM') && !isRage && (
            <g className="animate-bloom">
              <circle cx="-10" cy="-12" r="5" fill="#f472b6" />
              <circle cx="15" cy="-15" r="5" fill="#f472b6" />
              <circle cx="0" cy="-22" r="6" fill="#fb7185" />
            </g>
          )}
        </g>

        {/* Leaf Drop Animation */}
        {leafDropActive && (
          <circle cx="150" cy="120" r="6" fill={isRage ? "#ef4444" : "#d97706"} className="animate-leafDrop" />
        )}

        {/* Facial Expression on Trunk */}
        <g transform="translate(100, 135)">
          {isNapping ? (
            <g stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" fill="none">
              <path d="M -8 0 Q -4 4 0 0" />
              <path d="M 8 0 Q 12 4 16 0" />
            </g>
          ) : isRage ? (
            /* Fiery Angry Eyes */
            <g fill="#ef4444">
              <circle cx="-4" cy="0" r="4" />
              <circle cx="12" cy="0" r="4" />
              <path d="M -9 -6 L 1 -1" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 17 -6 L 7 -1" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="4" cy="6" rx="3.5" ry="2.5" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
            </g>
          ) : isDrooping ? (
            <g fill="#fef3c7">
              <ellipse cx="-4" cy="0" rx="3" ry="4" />
              <ellipse cx="12" cy="0" rx="3" ry="4" />
              <path d="M -2 8 Q 4 4 10 8" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            <g fill="#fef3c7">
              <circle cx="-4" cy="0" r="3.5" />
              <circle cx="12" cy="0" r="3.5" />
              <path d="M -4 5 Q 4 10 12 5" fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
