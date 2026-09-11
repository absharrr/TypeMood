import React from 'react';
import { MoodState } from '../../types/typing';

interface PlantProps {
  mood: MoodState;
  isBlooming: boolean;
  leafDropActive: boolean;
}

export const CactusPlant: React.FC<PlantProps> = ({ mood, isBlooming, leafDropActive }) => {
  const isDrooping = mood === 'ERRATIC';
  const isRage = mood === 'RAGE';
  const isShaking = mood === 'RAGE';
  const isNapping = mood === 'IDLE';

  const cactusFill = isRage ? "url(#cactusRageGrad)" : isDrooping ? "url(#cactusWiltGrad)" : "url(#cactusGrad)";

  return (
    <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-700 ${isShaking ? 'animate-shake' : ''}`}>
      <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="cactusGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="cactusWiltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="cactusRageGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="terracottaPot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isRage ? "#7f1d1d" : "#ea580c"} />
            <stop offset="100%" stopColor={isRage ? "#450a0a" : "#9a3412"} />
          </linearGradient>
        </defs>

        {/* Terracotta Pot */}
        <path d="M 75 170 L 85 222 C 85 228 155 228 155 222 L 165 170 Z" fill="url(#terracottaPot)" stroke={isRage ? "#ef4444" : "#7c2d12"} strokeWidth="3" />
        <rect x="70" y="160" width="100" height="12" rx="4" fill={isRage ? "#b91c1c" : "#f97316"} stroke={isRage ? "#ef4444" : "#7c2d12"} strokeWidth="3" />

        {/* Cactus Main Body */}
        <g transform={`translate(120, 160) scale(${isDrooping ? '0.9, 0.85' : isRage ? '1.08' : '1, 1'})`} className="transition-transform duration-700 origin-bottom">
          {/* Main Stem */}
          <rect
            x="-28"
            y="-100"
            width="56"
            height="100"
            rx="28"
            fill={cactusFill}
            stroke={isRage ? "#991b1b" : "#14532d"}
            strokeWidth="3"
          />

          {/* Left Arm */}
          <path
            d={`M -25 -50 Q ${isDrooping ? '-55 -40, -50 -20' : '-55 -50, -55 -80'} Q -40 -80 -40 -60 Q -30 -60 -25 -50`}
            fill={cactusFill}
            stroke={isRage ? "#991b1b" : "#14532d"}
            strokeWidth="3"
          />

          {/* Right Arm */}
          <path
            d={`M 25 -40 Q ${isDrooping ? '55 -30, 50 -10' : '55 -40, 55 -70'} Q 40 -70 40 -50 Q 30 -50 25 -40`}
            fill={cactusFill}
            stroke={isRage ? "#991b1b" : "#14532d"}
            strokeWidth="3"
          />

          {/* Cactus Needles / Spikes */}
          <g stroke={isRage ? "#f87171" : "#fef08a"} strokeWidth="2" strokeLinecap="round">
            <line x1="-20" y1="-80" x2="-28" y2="-84" />
            <line x1="20" y1="-80" x2="28" y2="-84" />
            <line x1="-24" y1="-50" x2="-32" y2="-52" />
            <line x1="24" y1="-50" x2="32" y2="-52" />
            <line x1="0" y1="-95" x2="0" y2="-103" />

            {/* Extra Spiky Spikes when Angry! */}
            {isShaking && (
              <g stroke="#ef4444" strokeWidth="2.5">
                <line x1="-15" y1="-65" x2="-26" y2="-72" />
                <line x1="15" y1="-65" x2="26" y2="-72" />
              </g>
            )}
          </g>

          {/* RAGE MODE: Billowing Smoke Clouds Floating from Top of Cactus Head */}
          {isRage && (
            <g transform="translate(0, -105)">
              <circle cx="-12" cy="0" r="14" fill="rgba(239, 68, 68, 0.85)" className="animate-rageSmoke" style={{ animationDelay: '0s' }} />
              <circle cx="10" cy="-5" r="16" fill="rgba(185, 28, 28, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '0.3s' }} />
              <circle cx="0" cy="-12" r="18" fill="rgba(156, 163, 175, 0.8)" className="animate-rageSmoke" style={{ animationDelay: '0.6s' }} />
              <circle cx="-8" cy="-20" r="15" fill="rgba(239, 68, 68, 0.6)" className="animate-rageSmoke" style={{ animationDelay: '0.9s' }} />
              <circle cx="12" cy="-25" r="20" fill="rgba(75, 85, 99, 0.75)" className="animate-rageSmoke" style={{ animationDelay: '1.2s' }} />
            </g>
          )}

          {/* Cute Flower Hat on Top */}
          {(isBlooming || !isDrooping) && !isRage && (
            <g transform="translate(0, -102)" className={isBlooming ? "animate-bloom" : ""}>
              <circle cx="0" cy="-4" r="6" fill="#ec4899" />
              <circle cx="-5" cy="0" r="6" fill="#f43f5e" />
              <circle cx="5" cy="0" r="6" fill="#f43f5e" />
              <circle cx="0" cy="4" r="6" fill="#ec4899" />
              <circle cx="0" cy="0" r="4" fill="#fef08a" />
            </g>
          )}

          {/* Leaf Drop / Spine Shed Effect */}
          {leafDropActive && (
            <line x1="-35" y1="-30" x2="-45" y2="20" stroke={isRage ? "#ef4444" : "#ca8a04"} strokeWidth="3" className="animate-leafDrop" />
          )}

          {/* Face on Cactus */}
          <g transform="translate(0, -50)">
            {isNapping ? (
              <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none">
                <path d="M -14 -2 Q -8 3 -2 -2" />
                <path d="M 2 -2 Q 8 3 14 -2" />
              </g>
            ) : isRage ? (
              /* Fiery Angry Eyes */
              <g fill="#ef4444">
                <circle cx="-10" cy="-2" r="4" />
                <circle cx="10" cy="-2" r="4" />
                <path d="M -16 -8 L -4 -2" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 16 -8 L 4 -2" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="0" cy="6" rx="4" ry="2.5" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
              </g>
            ) : isDrooping ? (
              <g fill="#ffffff">
                <circle cx="-10" cy="-2" r="4" />
                <circle cx="10" cy="-2" r="4" />
                <path d="M -8 10 Q 0 4 8 10" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : (
              <g fill="#ffffff">
                <circle cx="-10" cy="-2" r="4" />
                <circle cx="10" cy="-2" r="4" />
                <circle cx="-8" cy="-3.5" r="1.5" fill="#14532d" />
                <circle cx="12" cy="-3.5" r="1.5" fill="#14532d" />
                <path d="M -6 5 Q 0 11 6 5" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};
