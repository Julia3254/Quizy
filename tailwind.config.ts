import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        querion: {
          orange: "#ff4b1f",
          orange2: "#ff6a2a",
          red: "#ff1f2f",
          dark: "#080606",
          panel: "#190d0c",
          brown: "#2a1410"
        }
      },
      boxShadow: {
        glow: "0 0 32px rgba(255, 75, 31, .45)",
        glowStrong: "0 0 55px rgba(255, 75, 31, .70)"
      },
      backgroundImage: {
        querion: "radial-gradient(circle at 70% 42%, rgba(255, 75, 31, .52), transparent 34%), radial-gradient(circle at 18% 80%, rgba(255, 95, 31, .25), transparent 28%), linear-gradient(160deg, #050505 0%, #150807 42%, #080606 100%)"
      }
    }
  },
  plugins: []
};

export default config;
