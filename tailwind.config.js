/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'board-light': '#A0785A',
        'board-dark': '#8B5A3C',
        'move-indicator': '#5C7A7A',
        'block-outer': '#4A3728',
        'block-inner': '#5D4E37',
        'piece-white': '#F5E6D3',
        'piece-black': '#2C2C2C',
      },
      width: {
        '15': '60px',
      },
      height: {
        '15': '60px',
      },
    },
  },
  plugins: [],
}
