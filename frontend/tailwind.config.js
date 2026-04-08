/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: { // <--- THIS IS THE MISSING KEY
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
      },
      fontFamily: {
        main: "var(--main-font)",
      },
      borderRadius: {
        holidayCard: "var(--card-radius)",
      }
    },
  },
  plugins: [],
};