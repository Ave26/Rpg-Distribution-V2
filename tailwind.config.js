/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: "class",

  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        // sans: ["Open Sans Extrabold", "Courier New", "Courier", "monospace"],
      },
      animation: {
        fade: "fade .2s linear forwards",
        emerge: "emerge .5s linear forwards",
        "ping-slow": "ping 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
