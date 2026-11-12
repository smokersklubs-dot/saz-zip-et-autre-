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
        cyber: {
          dark: '#080c14',
          card: '#0f172a',
          border: '#1e293b',
          accent: '#06b6d4',
          green: '#10b981',
          purple: '#8b5cf6',
          orange: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}

