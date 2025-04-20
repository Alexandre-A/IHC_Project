/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primarySet: {
          brown: '#543A14',
          black: '#131010',
          orange: '#F0BB78',
          beige: '#FFF0DC'
        },
      },
    },
  },
  plugins: [],
}

