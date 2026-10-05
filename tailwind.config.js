/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        base: {
          950: '#060912',
          900: '#0a0e1a',
          850: '#0d1220',
          800: '#111729',
          700: '#182034',
          600: '#232d45',
          500: '#374260',
        },
        cyan: {
          glow: '#3fd0ff',
        },
        violet: {
          glow: '#a06bff',
        },
        ink: {
          100: '#eef2fb',
          300: '#b7c1dc',
          400: '#8b96b8',
          500: '#6b7594',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(63,208,255,0.15), 0 0 24px -4px rgba(63,208,255,0.35)',
        'glow-violet': '0 0 0 1px rgba(160,107,255,0.18), 0 0 24px -4px rgba(160,107,255,0.4)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 40px -20px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% -10%, rgba(63,208,255,0.12), transparent 40%), radial-gradient(circle at 100% 0%, rgba(160,107,255,0.10), transparent 35%)',
        'brand-gradient': 'linear-gradient(135deg, #3fd0ff 0%, #7c8bff 55%, #a06bff 100%)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.55 },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.2s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}
