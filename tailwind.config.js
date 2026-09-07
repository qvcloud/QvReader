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
        canvas: {
          light: '#ffffff',
          dark: '#1e1e1e',
        },
        surface: {
          light: '#f8fafc',
          dark: '#252526',
        },
        border: {
          light: '#e2e8f0',
          dark: '#333333',
        }
      }
    },
  },
  plugins: [],
}
