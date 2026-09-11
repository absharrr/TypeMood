/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f4fbf6',
          100: '#e3f6ea',
          200: '#c7edd5',
          300: '#9bdeb7',
          400: '#67c694',
          500: '#40aa75',
          600: '#2f8b5d',
          700: '#286f4c',
          800: '#23583e',
          900: '#1e4934',
        },
        calm: {
          light: '#e6f7ff',
          DEFAULT: '#1890ff',
          dark: '#0050b3'
        },
        rage: {
          light: '#fff1f0',
          DEFAULT: '#ff4d4f',
          dark: '#cf1322'
        },
        erratic: {
          light: '#fffbe6',
          DEFAULT: '#faad14',
          dark: '#d48806'
        }
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px) rotate(-1deg)' },
          '40%, 80%': { transform: 'translateX(4px) rotate(1deg)' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-1px, -1px)' },
        },
        floatZzz: {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-24px) scale(1.2)', opacity: '0' },
        },
        bloom: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '70%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        leafDrop: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(80px) rotate(180deg)', opacity: '0' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        rageSmoke: {
          '0%': { transform: 'translateY(0) scale(0.6) translateX(0)', opacity: '0.9' },
          '50%': { transform: 'translateY(-24px) scale(1.2) translateX(4px)', opacity: '0.7' },
          '100%': { transform: 'translateY(-48px) scale(1.7) translateX(-6px)', opacity: '0' },
        }
      },
      animation: {
        shake: 'shake 0.25s ease-in-out infinite',
        screenShake: 'screenShake 0.3s ease-in-out',
        floatZzz: 'floatZzz 2.5s ease-in-out infinite',
        bloom: 'bloom 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        leafDrop: 'leafDrop 1.2s ease-in forwards',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
        rageSmoke: 'rageSmoke 1.5s ease-out infinite',
      }
    },
  },
  plugins: [],
}
