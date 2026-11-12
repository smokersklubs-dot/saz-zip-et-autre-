/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        cockpit: {
          bg: '#060913',
          card: '#0c1322',
          well: '#080d18',
          border: '#1e293b',
          studio: '#F4F1EA',
        }
      },
      boxShadow: {
        'cockpit': '0 4px 24px -4px rgba(0, 0, 0, 0.45)',
        'glow-cyan': '0 0 18px rgba(6, 182, 212, 0.22)',
        'glow-indigo': '0 0 18px rgba(99, 102, 241, 0.22)',
        'glow-emerald': '0 0 18px rgba(16, 185, 129, 0.20)',
        'sticky-bar': '0 -6px 24px rgba(0, 0, 0, 0.65)',
      }
    },
  },
  plugins: [],
}
