/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Trezor dark theme — see design handoff "Design Tokens" (redesign).
        ink: '#04160C', // app background (deep canvas) / text-on-neon
        surface: '#0F3322', // card surface (lifted)
        inset: '#1B5236', // inset / input / stepper / chip-rest
        neon: '#60E198', // primary accent / CTAs / highlights
        brand: '#4BCE81', // gradient end
        pr: '#F2A065', // personal-record accent (orange)
        down: '#F79D69', // trend down (orange)
        soft: '#C9E4D5', // text soft
        muted: '#9FC8B2', // text muted
        faint: '#6E927F', // text faint / overlines
      },
      fontFamily: {
        display: ['"TT Satoshi"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        resume: '0 12px 30px -10px rgba(96,225,152,.6)',
        toast: '0 12px 30px -8px rgba(0,0,0,.4)',
      },
    },
  },
  plugins: [],
}
