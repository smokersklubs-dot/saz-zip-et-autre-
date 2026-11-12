/** @type {import('tailwindcss').Config} */
export default {
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
        maison: {
          canvas: '#F6F4EF',
          stone: '#EDE9DF',
          card: '#FFFFFF',
          border: '#E4DFD3',
          borderStrong: '#CFC7B6',
          ink: '#171614',
          slate: '#5A564E',
          muted: '#8C8579',
          brass: '#9E7840',
          brassLight: '#F7F1E5',
          emerald: '#1B5E42',
          emeraldLight: '#EBF5F0',
        }
      },
      boxShadow: {
        'atelier': '0 1px 3px rgba(23, 22, 20, 0.04), 0 8px 24px -6px rgba(23, 22, 20, 0.05)',
        'atelier-hover': '0 4px 12px rgba(23, 22, 20, 0.06), 0 16px 32px -8px rgba(23, 22, 20, 0.08)',
        'sticky-bar': '0 -4px 20px rgba(23, 22, 20, 0.08)',
      }
    },
  },
  plugins: [],
}
