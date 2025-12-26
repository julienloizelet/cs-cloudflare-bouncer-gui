/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crowdsec: {
          primary: '#5C7AEA',
          dark: '#1a1a2e',
          light: '#f0f0f5',
        },
      },
    },
  },
  plugins: [],
};