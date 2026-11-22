/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'Inter', 'Tahoma', 'sans-serif'],
        latin: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        surface: { DEFAULT: '#ffffff', muted: '#fafafa' },
        primary: { DEFAULT: '#171717', hover: '#262626' },
      },
    },
  },
  plugins: [],
}
