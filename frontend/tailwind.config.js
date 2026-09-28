/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111F',
        'bg-secondary': '#0B1728',
        card: '#101D2E',
        border: '#1D3045',
        primary: '#22D3EE',
        'primary-dark': '#0891B2',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#F8FAFC',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
