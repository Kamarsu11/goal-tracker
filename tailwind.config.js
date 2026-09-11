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
        tennis: {
          50: '#f6fee7',
          100: '#ecfccb',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          accent: '#ccff00', // Tennis ball neon yellow
        },
        brand: {
          dark: '#0b0f19',
          card: '#131b2e',
          cardHover: '#1a253e',
          border: '#1f2d4d',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
