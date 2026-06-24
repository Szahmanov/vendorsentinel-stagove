/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        sentinel: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          accent: '#818cf8',
        }
      },
    },
  },
  plugins: [],
}
