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
        darkbg: '#09090f',
        darkcard: '#141422',
        primary: {
          DEFAULT: '#7c5cff',
          dark: '#6246df',
          light: '#9b82ff'
        },
        success: '#00d48a',
        danger: '#ff4d67',
        text: '#f5f5f7',
        muted: '#888888',
        border: '#252538'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
