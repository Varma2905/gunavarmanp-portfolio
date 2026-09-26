import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05060b",
        foreground: "#f3f4f6",
        /* Spider-Man inspired palette. The `cyber` namespace is kept so the
           existing components keep their class names while re-skinning. */
        cyber: {
          blue: "#e62429",   // spider red (primary accent)
          cyan: "#ff3b3f",   // bright red highlight
          purple: "#2b6cff", // spider blue (secondary accent)
          pink: "#3b82f6",
          neon: "#ff5a5f",
          dark: "#0a0c14",
          card: "rgba(12, 14, 24, 0.7)",
          border: "rgba(230, 36, 41, 0.18)",
        },
        spider: {
          red: "#e62429",
          crimson: "#ff3b3f",
          blood: "#8f0f14",
          blue: "#2b6cff",
          navy: "#101a33",
          black: "#05060b",
          panel: "#0a0c14",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "spin-reverse": "spinReverse 28s linear infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "grid-move": "gridMove 20s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "web-draw": "webDraw 2.4s ease-out forwards",
        "dangle": "dangle 5s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "drop-shadow(0 0 15px rgba(230,36,41,0.4))" },
          "50%": { opacity: "0.9", filter: "drop-shadow(0 0 35px rgba(230,36,41,0.85))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        dangle: {
          "0%, 100%": { transform: "translateY(-6px) rotate(-1.5deg)" },
          "50%": { transform: "translateY(10px) rotate(1.5deg)" },
        },
        spinReverse: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        gridMove: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(50px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        webDraw: {
          "0%": { strokeDashoffset: "1200", opacity: "0" },
          "20%": { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
        glass: "16px",
      },
      boxShadow: {
        neon: "0 0 25px rgba(230, 36, 41, 0.35)",
        "neon-purple": "0 0 25px rgba(43, 108, 255, 0.35)",
        "web": "0 0 0 1px rgba(230,36,41,0.18), 0 18px 50px -12px rgba(230,36,41,0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.55)",
      },
    },
  },
  plugins: [],
};
export default config;
