import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryGray: "var(--primary-gray)",
        primaryWhite: "var(--primary-white)",
        primaryPurple: "var(--primary-purple)",
        primaryGold: "var(--primary-gold)",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'),],
}

export default config;