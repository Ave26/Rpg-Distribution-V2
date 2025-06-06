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

      // clamp (min, preffered, max)
      fontSize: {
        "fluid-lg": "clamp(1.5rem, 2.5vw + 1rem, 3.25rem)", // ~24px – 52px
        "fluid-md": "clamp(1.125rem, 2vw + 0.5rem, 2.5rem)", // ~18px – 40px
        "fluid-sm": "clamp(1rem, 1.25vw + 0.25rem, 1.75rem)", // ~16px – 28px
        "fluid-xs": "clamp(0.75rem, 0.75vw + 0.25rem, 1.25rem)", // ~14px – 20px
        "fluid-xxs": "clamp(0.625rem, 0.5vw + 0.2rem, 0.875rem)", // ~10px – 14px
        "fluid-xxxs": "clamp(0.5rem, 0.4vw + 0.15rem, 0.75rem)", // ~8px – 12px
        "fluid-xxxxs": "clamp(0.375rem, 0.3vw + 0.1rem, 0.625rem)", // ~6px – 10px
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
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
