import { KeyCategory, KeystrokeEvent, MoodState, RollingMetrics, PlantSpecies, ColorTheme } from '../types/typing';
import { KeystrokeTracker } from '../engine/KeystrokeTracker';
import { MetricsCalculator } from '../engine/MetricsCalculator';
import { MoodClassifier } from '../engine/MoodClassifier';
import { soundEffects } from '../engine/SoundEffectsService';

let shadowRootRef: ShadowRoot | null = null;
type DisplayMode = 'splitscreen' | 'minimized';
let currentMode: DisplayMode = 'splitscreen';
let activeTab: 'monitor' | 'heatmap' | 'weather' = 'monitor';

// Engine instances for instant <1ms in-page reactivity
const localTracker = new KeystrokeTracker(8000);
const localClassifier = new MoodClassifier();

let latestMood: MoodState = 'IDLE';
let currentSpecies: PlantSpecies = 'FERN';
let currentTheme: ColorTheme = 'default';
let soundEnabled = true;

let latestMetrics: RollingMetrics = {
  wpm: 0,
  ikiMean: 0,
  ikiVariance: 0,
  backspaceCount: 0,
  backspaceRatio: 0,
  burstCount: 0,
  idleSeconds: 999,
  totalKeysInWindow: 0,
};

// Theme color definitions
const THEME_PALETTES: Record<ColorTheme, { bg: string; cardBg: string; text: string; accent: string; border: string }> = {
  default: { bg: '#020617', cardBg: '#0f172a', text: '#f8fafc', accent: '#34d399', border: 'rgba(16, 185, 129, 0.4)' },
  sage: { bg: '#1a1d17', cardBg: '#232720', text: '#F7F2EB', accent: '#8B9A6E', border: 'rgba(139, 154, 110, 0.4)' },
  crimson: { bg: '#180404', cardBg: '#2D0000', text: '#EEEAD7', accent: '#757D6F', border: 'rgba(109, 8, 8, 0.5)' },
  ocean: { bg: '#081a24', cardBg: '#0f2937', text: '#FCE59A', accent: '#2BBBD7', border: 'rgba(43, 187, 215, 0.4)' },
  forest: { bg: '#121612', cardBg: '#2E2910', text: '#EBE3A7', accent: '#EB7D00', border: 'rgba(235, 125, 0, 0.4)' },
};

// Render Full Animated SVG Plant with Fiery Red RAGE Mode & Billowing Smoke
const renderSvgPlant = (mood: MoodState, species: PlantSpecies): string => {
  const isDrooping = mood === 'ERRATIC';
  const isRage = mood === 'RAGE';
  const isShaking = mood === 'RAGE';
  const isNapping = mood === 'IDLE';

  const leafFill = isRage ? '#ef4444' : isDrooping ? '#fbbf24' : '#34d399';
  const stemStroke = isRage ? '#991b1b' : '#059669';
  const potFill = isRage ? '#7f1d1d' : species === 'CACTUS' ? '#ea580c' : '#94a3b8';
  const potStroke = isRage ? '#ef4444' : species === 'CACTUS' ? '#7c2d12' : '#64748b';

  return `
    <div style="width: 170px; height: 170px; margin: 0 auto; transition: all 0.5s; ${isShaking ? 'animation: typemood-shake 0.25s infinite;' : ''}">
      <svg viewBox="0 0 240 240" style="width: 100%; height: 100%;">
        <!-- Billowing Smoke Clouds floating from head during RAGE -->
        ${isRage ? `
          <g transform="translate(120, 45)">
            <circle cx="-12" cy="0" r="14" fill="rgba(239, 68, 68, 0.85)" style="animation: typemood-smoke 1.5s ease-out infinite; animation-delay: 0s;" />
            <circle cx="10" cy="-5" r="16" fill="rgba(185, 28, 28, 0.75)" style="animation: typemood-smoke 1.5s ease-out infinite; animation-delay: 0.3s;" />
            <circle cx="0" cy="-12" r="18" fill="rgba(156, 163, 175, 0.8)" style="animation: typemood-smoke 1.5s ease-out infinite; animation-delay: 0.6s;" />
            <circle cx="-8" cy="-20" r="15" fill="rgba(239, 68, 68, 0.6)" style="animation: typemood-smoke 1.5s ease-out infinite; animation-delay: 0.9s;" />
            <circle cx="12" cy="-25" r="20" fill="rgba(75, 85, 99, 0.75)" style="animation: typemood-smoke 1.5s ease-out infinite; animation-delay: 1.2s;" />
          </g>
        ` : ''}

        <ellipse cx="120" cy="180" rx="55" ry="12" fill="#451a03" />
        <path d="M 70 178 L 80 220 C 80 226 160 226 160 220 L 170 178 Z" fill="${potFill}" stroke="${potStroke}" stroke-width="3" />
        <rect x="65" y="170" width="110" height="12" rx="4" fill="${isRage ? '#b91c1c' : species === 'CACTUS' ? '#f97316' : '#cbd5e1'}" stroke="${potStroke}" stroke-width="3" />
        
        <g transform="translate(120, 172) scale(${isRage ? '1.1' : isDrooping ? '0.85' : '1.05'})" style="transition: transform 0.5s;">
          ${species === 'CACTUS' ? `
            <rect x="-24" y="-85" width="48" height="85" rx="24" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#22c55e'}" stroke="${isRage ? '#991b1b' : '#15803d'}" stroke-width="3" />
            <path d="M -20 -40 Q -45 -40, -45 -65 Q -30 -65 -20 -40" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#22c55e'}" stroke="${isRage ? '#991b1b' : '#15803d'}" stroke-width="3" />
            <path d="M 20 -30 Q 45 -30, 45 -55 Q 30 -55 20 -30" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#22c55e'}" stroke="${isRage ? '#991b1b' : '#15803d'}" stroke-width="3" />
          ` : species === 'BONSAI' ? `
            <path d="M 0 0 C -10 -25, -50 -35, -30 -75 C -20 -90, 10 -100, 0 -110" fill="none" stroke="${isRage ? '#7f1d1d' : '#78350f'}" stroke-width="12" stroke-linecap="round" />
            <circle cx="-30" cy="-75" r="24" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#10b981'}" />
            <circle cx="20" cy="-85" r="22" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#10b981'}" />
            <circle cx="0" cy="-110" r="30" fill="${isRage ? '#ef4444' : isDrooping ? '#d97706' : '#10b981'}" />
          ` : `
            <path d="M 0 0 C ${isDrooping || isRage ? '15 -40, -20 -80' : '0 -40, 0 -110'}" fill="none" stroke="${stemStroke}" stroke-width="5" />
            <g transform="rotate(${isRage ? '-45' : isDrooping ? '-35' : '-15'})">
              <path d="M 0 0 C -20 -30, -50 -50, -65 -70" fill="none" stroke="${stemStroke}" stroke-width="4" />
              <path d="M -65 -70 Q -45 -90 -25 -70 Q -45 -50 -65 -70" fill="${leafFill}" />
            </g>
            <g transform="rotate(${isRage ? '45' : isDrooping ? '35' : '15'})">
              <path d="M 0 0 C 20 -30, 50 -50, 65 -70" fill="none" stroke="${stemStroke}" stroke-width="4" />
              <path d="M 65 -70 Q 45 -90 25 -70 Q 45 -50 65 -70" fill="${leafFill}" />
            </g>
          `}
        </g>

        <!-- Expressive Facial Reactions -->
        <g transform="translate(120, 198)">
          ${isNapping ? `
            <g stroke="#334155" stroke-width="2.5" stroke-linecap="round" fill="none">
              <path d="M -16 -2 Q -10 4 -4 -2" />
              <path d="M 4 -2 Q 10 4 16 -2" />
            </g>
          ` : isRage ? `
            <g fill="#ef4444">
              <circle cx="-10" cy="0" r="4.5" />
              <circle cx="10" cy="0" r="4.5" />
              <path d="M -16 -8 L -4 -2" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              <path d="M 16 -8 L 4 -2" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              <ellipse cx="0" cy="6" rx="4" ry="3" fill="#991b1b" stroke="#ef4444" stroke-width="1.5" />
            </g>
          ` : isDrooping ? `
            <g fill="#334155">
              <circle cx="-10" cy="0" r="3.5" />
              <circle cx="10" cy="0" r="3.5" />
              <ellipse cx="0" cy="8" rx="3" ry="2" fill="none" stroke="#334155" stroke-width="2" />
            </g>
          ` : `
            <g fill="#1e293b">
              <circle cx="-10" cy="0" r="4" />
              <circle cx="10" cy="0" r="4" />
              <circle cx="-8.5" cy="-1.5" r="1.5" fill="#ffffff" />
              <circle cx="11.5" cy="-1.5" r="1.5" fill="#ffffff" />
              <path d="M -6 4 Q 0 9 6 4" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" />
            </g>
          `}
        </g>
      </svg>
    </div>
  `;
};

// Update UI in Shadow DOM dynamically
const updateShadowDomUI = () => {
  if (!shadowRootRef) return;

  const moodEmojiMap: Record<MoodState, string> = {
    CALM: '🌿',
    ERRATIC: '🥀',
    RAGE: '🌋',
    IDLE: '💤',
    RECOVERING: '🌱',
  };

  const moodLabelMap: Record<MoodState, string> = {
    CALM: 'Growing & Peaceful',
    ERRATIC: 'Wilting & Distressed',
    RAGE: '🔥 RAGE SHAKING! 🔥',
    IDLE: 'Napping... (zZZ)',
    RECOVERING: 'Healing Soil & Leaves',
  };

  const emojiSpan = shadowRootRef.querySelector('#typemood-emoji-span') as HTMLElement;
  const wpmVal = shadowRootRef.querySelector('#typemood-wpm-val') as HTMLElement;
  const jitterVal = shadowRootRef.querySelector('#typemood-jitter-val') as HTMLElement;
  const corrVal = shadowRootRef.querySelector('#typemood-corr-val') as HTMLElement;
  const burstVal = shadowRootRef.querySelector('#typemood-burst-val') as HTMLElement;
  const svgContainer = shadowRootRef.querySelector('#typemood-svg-container') as HTMLElement;

  if (emojiSpan) emojiSpan.innerText = moodEmojiMap[latestMood] || '🌿';
  if (wpmVal) wpmVal.innerHTML = `${latestMetrics.wpm} <span style="font-size: 10px; font-weight: normal; opacity: 0.7;">WPM</span>`;
  if (jitterVal) jitterVal.innerHTML = `${latestMetrics.ikiVariance} <span style="font-size: 10px; font-weight: normal; opacity: 0.7;">ms</span>`;
  if (corrVal) corrVal.innerHTML = `${Math.round(latestMetrics.backspaceRatio * 100)}%`;
  if (burstVal) burstVal.innerHTML = `${latestMetrics.burstCount}`;

  if (svgContainer) {
    const t = THEME_PALETTES[currentTheme];
    const isRage = latestMood === 'RAGE';
    const activeAccent = isRage ? '#ef4444' : t.accent;

    svgContainer.innerHTML = `
      ${renderSvgPlant(latestMood, currentSpecies)}
      <div style="margin-top: 10px; display: inline-block; padding: 5px 14px; border-radius: 9999px; background: ${isRage ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${activeAccent}; color: ${activeAccent}; font-size: 12px; font-weight: 800;">
        ${moodLabelMap[latestMood]}
      </div>
    `;
  }
};

// Universal Browser Capture: Intercept keydown timing deltas across any webpage element or frame
const handleGlobalKeyDown = (e: KeyboardEvent) => {
  if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
    return;
  }

  // 1. Process local tracker instantly
  localTracker.handleKeyDown(e);
  const events = localTracker.getEvents();
  const lastTs = localTracker.getLastKeyTimestamp();
  latestMetrics = MetricsCalculator.calculate(events, lastTs, 8000);
  const nextMood = localClassifier.update(latestMetrics);

  if (nextMood !== latestMood) {
    latestMood = nextMood;
    soundEffects.playMoodSound(latestMood, soundEnabled);
  }

  updateShadowDomUI();

  // 2. Send event payload to background worker for history logging
  const now = Date.now();
  let category: KeyCategory = 'OTHER';
  if (e.key === 'Backspace' || e.key === 'Delete') {
    category = 'BACKSPACE';
  } else if (e.key && (e.key.length === 1 || e.key === 'Enter' || e.key === 'Spacebar')) {
    category = 'PRINTABLE';
  }

  const eventPayload: KeystrokeEvent = {
    timestamp: now,
    interKeyInterval: events.length > 0 ? events[events.length - 1].interKeyInterval : 0,
    category,
  };

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({
      type: 'TYPEMOOD_KEYSTROKE',
      payload: eventPayload,
    }).catch(() => {});
  }
};

window.addEventListener('keydown', handleGlobalKeyDown, true);

// Ticker to handle idle state decay locally
setInterval(() => {
  const events = localTracker.getEvents();
  const lastTs = localTracker.getLastKeyTimestamp();
  latestMetrics = MetricsCalculator.calculate(events, lastTs, 8000);
  const nextMood = localClassifier.update(latestMetrics);
  if (nextMood !== latestMood) {
    latestMood = nextMood;
    soundEffects.playMoodSound(latestMood, soundEnabled);
  }
  updateShadowDomUI();
}, 800);

// Create 30% Left Split Screen Sidebar (EXACT CLONE UI of Extension App)
const createFloatingWidget = () => {
  if (window.top !== window.self) return; // Skip if inside an iframe
  if (document.getElementById('typemood-root-host')) return;

  if (sessionStorage.getItem('typemood_widget_dismissed') === 'true') {
    return;
  }

  const host = document.createElement('div');
  host.id = 'typemood-root-host';
  host.style.position = 'fixed';
  host.style.top = '0';
  host.style.left = '0';
  host.style.height = '100vh';
  host.style.zIndex = '2147483647';
  host.style.pointerEvents = 'auto';

  const shadow = host.attachShadow({ mode: 'open' });
  shadowRootRef = shadow;

  // Push webpage content over by 30% width when split screen is active
  const updatePageLayout = (active: boolean) => {
    if (active) {
      document.body.style.transition = 'margin-left 0.3s ease';
      document.body.style.marginLeft = '30vw';
    } else {
      document.body.style.marginLeft = '0px';
    }
  };

  const render = () => {
    const t = THEME_PALETTES[currentTheme];

    const moodEmojiMap: Record<MoodState, string> = {
      CALM: '🌿',
      ERRATIC: '🥀',
      RAGE: '🌋',
      IDLE: '💤',
      RECOVERING: '🌱',
    };

    const moodLabelMap: Record<MoodState, string> = {
      CALM: 'Growing & Peaceful',
      ERRATIC: 'Wilting & Distressed',
      RAGE: '🔥 RAGE SHAKING! 🔥',
      IDLE: 'Napping... (zZZ)',
      RECOVERING: 'Healing Soil & Leaves',
    };

    const emoji = moodEmojiMap[latestMood] || '🌿';

    const styleCss = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes typemood-shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px) rotate(-3deg); }
        40%, 80% { transform: translateX(6px) rotate(3deg); }
      }
      @keyframes typemood-smoke {
        0% { transform: translateY(0) scale(0.8); opacity: 0.8; }
        50% { opacity: 0.9; }
        100% { transform: translateY(-28px) scale(1.3); opacity: 0; }
      }
      .typemood-sidebar {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: ${t.text};
        user-select: none;
        width: 30vw;
        min-width: 300px;
        max-width: 420px;
        height: 100vh;
        background: ${latestMood === 'RAGE' ? '#180404' : t.bg};
        border-right: 1px solid ${latestMood === 'RAGE' ? '#ef4444' : t.border};
        box-shadow: 10px 0 35px rgba(0, 0, 0, 0.6);
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        overflow-y: auto;
        transition: background 0.5s, border-color 0.5s;
      }
      .typemood-mini-bubble {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: ${t.cardBg};
        border: 1px solid ${t.border};
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        padding: 10px 14px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 13px;
        color: ${t.text};
        font-family: system-ui, sans-serif;
      }
      .btn-icon {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #cbd5e1;
        border-radius: 8px;
        width: 28px;
        height: 28px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .btn-icon:hover { background: rgba(255, 255, 255, 0.25); color: #fff; }
      .metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        font-family: monospace;
      }
      .metric-box {
        background: ${t.cardBg};
        padding: 10px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .tab-btn {
        padding: 4px 10px;
        border-radius: 9999px;
        border: none;
        background: transparent;
        color: #94a3b8;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tab-btn.active {
        background: ${latestMood === 'RAGE' ? '#ef4444' : t.accent};
        color: #020617;
        font-weight: 800;
      }
      .species-btn {
        padding: 4px 10px;
        border-radius: 9999px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: ${t.text};
        font-size: 11px;
        cursor: pointer;
      }
      .swatch {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid rgba(255,255,255,0.3);
      }
    `;

    let contentHtml = '';

    if (currentMode === 'splitscreen') {
      updatePageLayout(true);
      contentHtml = `
        <div class="typemood-sidebar">
          <!-- Exact Header Toolbar without 'Left 30% Split View' text -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 32px; height: 32px; border-radius: 10px; background: ${latestMood === 'RAGE' ? '#ef4444' : t.accent}; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                🌿
              </div>
              <div>
                <div style="font-weight: 800; font-size: 16px; color: ${t.text};">TypeMood</div>
              </div>
            </div>

            <!-- Header Actions & Controls -->
            <div style="display: flex; align-items: center; gap: 6px;">
              <button class="species-btn" id="typemood-species-cycle" title="Change Plant Species">
                ${currentSpecies === 'FERN' ? '🌿 Fern' : currentSpecies === 'BONSAI' ? '🪴 Bonsai' : '🌵 Cactus'}
              </button>

              <button class="btn-icon" id="typemood-min-btn" title="Minimize sidebar to bubble">-</button>
              <button class="btn-icon" id="typemood-close-btn" title="Close split sidebar">✕</button>
            </div>
          </div>

          <!-- Color Palette Swatch Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: ${t.cardBg}; padding: 6px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); font-size: 11px;">
            <span style="color: #94a3b8; font-weight: 600;">Theme:</span>
            <div style="display: flex; gap: 6px;">
              <span class="swatch" style="background: #10b981;" id="theme-default" title="Emerald Dark"></span>
              <span class="swatch" style="background: #8B9A6E;" id="theme-sage" title="Sage & Cream"></span>
              <span class="swatch" style="background: #6D0808;" id="theme-crimson" title="Crimson Mahogany"></span>
              <span class="swatch" style="background: #218DAE;" id="theme-ocean" title="Ocean & Sunshine"></span>
              <span class="swatch" style="background: #2C5745;" id="theme-forest" title="Forest Terracotta"></span>
            </div>
          </div>

          <!-- Tab Navigation Bar -->
          <div style="display: flex; background: rgba(0,0,0,0.3); padding: 3px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.06); justify-content: space-around;">
            <button class="tab-btn ${activeTab === 'monitor' ? 'active' : ''}" id="tab-monitor">Monitor</button>
            <button class="tab-btn ${activeTab === 'heatmap' ? 'active' : ''}" id="tab-heatmap">Heatmap</button>
            <button class="tab-btn ${activeTab === 'weather' ? 'active' : ''}" id="tab-weather">Report</button>
          </div>

          <!-- Tab Content Views -->
          ${activeTab === 'monitor' ? `
            <!-- SVG Visual Plant Display -->
            <div style="background: ${t.cardBg}; padding: 14px; border-radius: 20px; text-align: center; border: 1px solid ${latestMood === 'RAGE' ? '#ef4444' : 'rgba(255,255,255,0.08)'};" id="typemood-svg-container">
              ${renderSvgPlant(latestMood, currentSpecies)}
              <div style="margin-top: 10px; display: inline-block; padding: 5px 14px; border-radius: 9999px; background: ${latestMood === 'RAGE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)'}; border: 1px solid ${latestMood === 'RAGE' ? '#ef4444' : t.accent}; color: ${latestMood === 'RAGE' ? '#ef4444' : t.accent}; font-size: 12px; font-weight: 800;">
                ${moodLabelMap[latestMood]}
              </div>
            </div>

            <!-- Telemetry HUD -->
            <div class="metrics-grid">
              <div class="metric-box">
                <div style="color: #94a3b8; font-size: 9px; text-transform: uppercase;">Speed</div>
                <div style="font-weight: bold; color: ${t.text}; font-size: 15px;" id="typemood-wpm-val">${latestMetrics.wpm} <span style="font-size: 9px; opacity: 0.7;">WPM</span></div>
              </div>
              <div class="metric-box">
                <div style="color: #94a3b8; font-size: 9px; text-transform: uppercase;">Rhythm Jitter</div>
                <div style="font-weight: bold; color: ${t.text}; font-size: 15px;" id="typemood-jitter-val">${latestMetrics.ikiVariance} <span style="font-size: 9px; opacity: 0.7;">ms</span></div>
              </div>
              <div class="metric-box">
                <div style="color: #94a3b8; font-size: 9px; text-transform: uppercase;">Corrections</div>
                <div style="font-weight: bold; color: ${t.text}; font-size: 15px;" id="typemood-corr-val">${Math.round(latestMetrics.backspaceRatio * 100)}%</div>
              </div>
              <div class="metric-box">
                <div style="color: #94a3b8; font-size: 9px; text-transform: uppercase;">Bursts</div>
                <div style="font-weight: bold; color: ${t.text}; font-size: 15px;" id="typemood-burst-val">${latestMetrics.burstCount}</div>
              </div>
            </div>

            <!-- Mood Audio Soundboard -->
            <div style="background: ${t.cardBg}; padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); font-size: 11px;">
              <div style="font-weight: bold; color: ${t.text}; margin-bottom: 8px;">Audio Soundboard</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <button class="species-btn" id="snd-calm" style="text-align: left;">🌸 Bloom</button>
                <button class="species-btn" id="snd-erratic" style="text-align: left;">🥀 Wobble</button>
                <button class="species-btn" id="snd-rage" style="text-align: left; background: rgba(239,68,68,0.2); border-color: #ef4444;">🌋 Rumble</button>
                <button class="species-btn" id="snd-idle" style="text-align: left;">💤 Lullaby</button>
              </div>
            </div>
          ` : activeTab === 'heatmap' ? `
            <div style="background: ${t.cardBg}; padding: 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); text-align: center;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">30-Day Mood Heatmap</div>
              <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; padding: 6px;">
                ${Array.from({ length: 30 }).map((_, i) => `
                  <div style="height: 24px; border-radius: 6px; background: ${i % 3 === 0 ? t.accent : i % 5 === 0 ? '#f59e0b' : '#334155'}; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold;">
                    ${i + 1}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div style="background: ${t.cardBg}; padding: 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);">
              <div style="font-weight: bold; font-size: 14px; color: ${t.accent};">Typing Weather Report</div>
              <div style="font-size: 12px; color: #cbd5e1; margin: 8px 0;">Mostly Serene & Sunny ☀️</div>
              <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">- 65% Serene ☀️<br/>- 20% Thunderstorm 🌩️<br/>- 15% Foggy 🌫️</div>
            </div>
          `}

          <div style="margin-top: auto; font-size: 10px; color: #64748b; font-style: italic; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
            🔒 Zero Keylogging • Timing Deltas Only
          </div>
        </div>
      `;
    } else {
      updatePageLayout(false);
      contentHtml = `
        <div class="typemood-mini-bubble" id="typemood-bubble-toggle" title="Click to Expand 30% Left Split-Screen Sidebar">
          <span style="font-size: 18px;" id="typemood-emoji-span">${emoji}</span>
          <span style="font-weight: 700; color: ${latestMood === 'RAGE' ? '#ef4444' : t.accent};">TypeMood</span>
        </div>
      `;
    }

    shadow.innerHTML = `<style>${styleCss}</style>${contentHtml}`;

    // Handlers
    const bubbleToggle = shadow.querySelector('#typemood-bubble-toggle');
    if (bubbleToggle) {
      bubbleToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMode = 'splitscreen';
        render();
      });
    }

    const minBtn = shadow.querySelector('#typemood-min-btn');
    if (minBtn) {
      minBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentMode = 'minimized';
        render();
      });
    }

    const closeBtn = shadow.querySelector('#typemood-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updatePageLayout(false);
        sessionStorage.setItem('typemood_widget_dismissed', 'true');
        host.remove();
        shadowRootRef = null;
      });
    }

    // Species Cycle
    const speciesBtn = shadow.querySelector('#typemood-species-cycle');
    if (speciesBtn) {
      speciesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const speciesList: PlantSpecies[] = ['FERN', 'BONSAI', 'CACTUS'];
        const nextIdx = (speciesList.indexOf(currentSpecies) + 1) % speciesList.length;
        currentSpecies = speciesList[nextIdx];
        render();
      });
    }

    // Theme Swatches
    const themes: ColorTheme[] = ['default', 'sage', 'crimson', 'ocean', 'forest'];
    themes.forEach((th) => {
      const el = shadow.querySelector(`#theme-${th}`);
      if (el) {
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          currentTheme = th;
          render();
        });
      }
    });

    // Tab buttons
    const tabMon = shadow.querySelector('#tab-monitor');
    if (tabMon) tabMon.addEventListener('click', () => { activeTab = 'monitor'; render(); });

    const tabHeat = shadow.querySelector('#tab-heatmap');
    if (tabHeat) tabHeat.addEventListener('click', () => { activeTab = 'heatmap'; render(); });

    const tabWeath = shadow.querySelector('#tab-weather');
    if (tabWeath) tabWeath.addEventListener('click', () => { activeTab = 'weather'; render(); });

    // Soundboard
    const sndCalm = shadow.querySelector('#snd-calm');
    if (sndCalm) sndCalm.addEventListener('click', () => soundEffects.playMoodSound('CALM', true));

    const sndErr = shadow.querySelector('#snd-erratic');
    if (sndErr) sndErr.addEventListener('click', () => soundEffects.playMoodSound('ERRATIC', true));

    const sndRage = shadow.querySelector('#snd-rage');
    if (sndRage) sndRage.addEventListener('click', () => soundEffects.playMoodSound('RAGE', true));

    const sndIdle = shadow.querySelector('#snd-idle');
    if (sndIdle) sndIdle.addEventListener('click', () => soundEffects.playMoodSound('IDLE', true));
  };

  render();
  document.body.appendChild(host);
};

// Inject floating widget
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingWidget);
} else {
  createFloatingWidget();
}
