import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-poem)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-ui)", "system-ui", "sans-serif"],
        mono: ["var(--font-catalog)", "Courier New", "monospace"],
      },
      colors: {
        paper: "#F7F5EF",
        surface: "#FFFFFF",
        sidebar: "#EFEAE0",
        border: "#C9C2B2",
        ink: "#2B2620",
        muted: "#6B6355",
        link: "#1F5C99",
        stamp: "#9B3A2E",
      },
    },
  },
  plugins: [],
};

export default config;
