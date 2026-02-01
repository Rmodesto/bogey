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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "ice-blue": "#a9cfe3",
        "deep-ice-blue": "#6fa6c6",
        "mist-blue": "#e7f2f8",
        "volt-green": "#9cd94a",
        "volt-lime": "#7fbf2e",
        "volt-mist": "#eaf6d8",
        "jet-black": "#0e1114",
        graphite: "#2b2f33",
        slate: "#8a9198",
        "fog-gray": "#f6f8fa",
        "divider-gray": "#e3e6ea",
      },
      fontFamily: {
        sans: [
          "Helvetica Neue",
          "Helvetica",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
