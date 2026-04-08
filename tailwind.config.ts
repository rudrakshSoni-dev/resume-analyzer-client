import type { Config } from "tailwindcss";

const config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        linkedin: {
          primary: "#0A66C2",
          accent: "#70B5F9",
          bg: "#F3F2EF",
          dark: "#1B1F23",
        },
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;