# TypeMood 🌿

> *"It's not you, it's your keyboard cadence."*

**TypeMood** is an ambient, privacy-first virtual plant companion that reacts in real-time to your typing rhythm, speed, pauses, and backspace frequency — with **zero keylogging** of typed content.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-typemood.vercel.app-10b981?style=for-the-badge&logo=vercel)](https://typemood.vercel.app)
[![Download Extension](https://img.shields.io/badge/Download%20Extension-.ZIP-3b82f6?style=for-the-badge&logo=googlechrome)](https://typemood.vercel.app/typemood-extension.zip)

---

## ✨ Key Features

- 🌿 **3 Virtual Plant Species**: Choose between **Fern**, **Bonsai**, and **Cactus**, each with custom foliage, pot styles, and expressive facial reactions.
- 🔥 **RAGE Mode Shaking & Billowing Smoke**: When typing fast or furiously slamming backspaces, the plant turns fiery red, emits billowing smoke clouds from its head, and shakes on screen!
- 🚀 **Universal Chrome Extension (Manifest V3)**: Docks as a 30% Left Split-Screen Sidebar (`width: 30vw`) pushing webpage content into the remaining 70% with Shadow DOM CSS isolation.
- 🎨 **5 Aesthetic Color Palettes**: Toggle between Emerald Dark, Sage & Cream, Crimson Mahogany, Ocean & Sunshine, and Forest Terracotta.
- 🔒 **Strict Zero-Keylogging Privacy**: Only timestamp deltas (ms between keys) and key categories (`PRINTABLE` vs `BACKSPACE`) are processed locally. Character values are never stored or transmitted.
- 🎵 **Web Audio Synthesizer**: Procedurally generated audio chimes for Bloom 🌸, Wobble 🥀, Rumble 🌋, Lullaby 💤, and Heal 🌱.
- 📊 **30-Day Heatmap & PNG Exporter**: View your monthly cadence heatmap calendar and export downloadable PNG weather report cards.

---

## 🌐 Live Web App & Chrome Extension

- **Live Web App**: [https://typemood.vercel.app](https://typemood.vercel.app)
- **Download Extension (.zip)**: [https://typemood.vercel.app/typemood-extension.zip](https://typemood.vercel.app/typemood-extension.zip)

---

## 📦 How to Install Chrome Extension

1. Download `typemood-extension.zip` from [typemood.vercel.app](https://typemood.vercel.app).
2. Extract the downloaded ZIP folder.
3. Open Chrome and navigate to `chrome://extensions`.
4. Enable **Developer mode** (top right toggle).
5. Click **Load unpacked** and select the unzipped extension directory!

---

## 🛠️ Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, CSS Keyframe Animations
- **Audio Engine**: Web Audio API (procedural oscillator synthesizer)
- **Extension Tech**: Chrome Extension Manifest V3, Shadow DOM, ESBuild
- **Icon Rendering**: Sharp
- **Hosting & Deployment**: Vercel & GitHub

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/absharrr/TypeMood.git
cd TypeMood

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production and package Chrome extension
npm run build
```
