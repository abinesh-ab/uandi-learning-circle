/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          darkblue: '#1E40AF',
          yellow: '#D97706',
          gold: '#F59E0B',
          red: '#E11D48',
          slate: '#0F172A',
          lightbg: '#F8FAFC',
        },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
