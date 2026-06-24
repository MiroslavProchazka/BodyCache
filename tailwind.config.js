/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Revolut-inspired theme — true-black canvas + cobalt-violet accent.
        ink: '#000000', // app background (true black) / text on light & accent surfaces
        surface: '#16181a', // card surface (elevated off black)
        inset: '#23262b', // inset / input / stepper / chip-rest
        neon: '#494fdf', // brand accent (cobalt violet) — accents, selected, fills
        brand: '#7c82f5', // gradient end (lighter cobalt)
        pr: '#eaa44a', // personal-record accent (amber)
        down: '#ff9a4d', // trend down (orange)
        soft: 'rgba(255,255,255,0.80)', // text soft
        muted: 'rgba(255,255,255,0.60)', // text muted
        faint: 'rgba(255,255,255,0.42)', // text faint / overlines
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        resume: '0 12px 30px -10px rgba(73,79,223,.5)',
        toast: '0 12px 30px -8px rgba(0,0,0,.4)',
      },
    },
  },
  plugins: [],
}
