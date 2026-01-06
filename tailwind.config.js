/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        slate: {
          850: "#151b28",
          900: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
