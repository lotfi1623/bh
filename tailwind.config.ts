import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#111111",
        border: "rgba(255,255,255,0.08)",
        muted: "#BDBDBD",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(255,255,255,0.12)",
        "glow-sm": "0 0 12px rgba(255,255,255,0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
