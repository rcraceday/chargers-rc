/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
  colors: {
    "chargers-light": "#EAF6FF",
    "chargers-blue": "#1d1d37",
    "chargers-lblue": "#3f7aeb",
  },
  fontFamily: {
    poppins: ["Poppins", "sans-serif"],
  },
    },
  },
  plugins: [],
};
