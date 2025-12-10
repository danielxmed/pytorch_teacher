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
        // PyTorch orange
        pytorch: {
          50: '#fef3f2',
          100: '#fee4e1',
          200: '#fecdc8',
          300: '#fcaba2',
          400: '#f87b6d',
          500: '#ee4c2c', // Primary PyTorch orange
          600: '#dc3d22',
          700: '#b93019',
          800: '#992b19',
          900: '#7f291b',
        },
        // Dark theme colors (Dracula inspired)
        dark: {
          bg: '#1a1a2e',
          surface: '#16213e',
          border: '#0f3460',
          text: '#e4e4e7',
          muted: '#a1a1aa',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
