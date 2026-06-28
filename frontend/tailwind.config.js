/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: { DEFAULT: '#0a0a0f', 100: '#12121a', 200: '#1a1a2e', 300: '#252540' },
        primary: { DEFAULT: '#7c3aed', light: '#a78bfa', dark: '#5b21b6' },
        accent: { DEFAULT: '#06b6d4', light: '#22d3ee' },
        neon: { purple: '#c084fc', cyan: '#22d3ee', pink: '#f472b6' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
        'neon-gradient': 'linear-gradient(90deg, #7c3aed, #06b6d4, #f472b6)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        glow: { '0%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' }, '100%': { boxShadow: '0 0 40px rgba(6,182,212,0.5)' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};