/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fdf4ff',
          500: '#d946ef',
          900: '#701a75',
        }
      },
    },
  },
  plugins: [],
}
