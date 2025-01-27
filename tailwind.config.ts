import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1B4332", // Darker green for better contrast
          light: "#2D6A4F",   // Light variation
          dark: "#081C15",    // Dark variation
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#40916C", // More vibrant secondary
          light: "#52B788",   // Light variation
          dark: "#2D6A4F",    // Dark variation
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#D8572A", // Warmer accent
          light: "#E07A5F",   // Light variation
          dark: "#B23B1A",    // Dark variation
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F0F4F1",  // Lighter muted background
          foreground: "#4B635A",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1B4332", // Match primary color
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.3s ease-in-out", // Smoother timing
        "accordion-up": "accordion-up 0.3s ease-in-out",     // Smoother timing
        "fade-in": "fadeIn 0.8s ease-out",                   // Slightly faster fade
      },
    },   /* Close 'extend' */
  },     /* Close 'theme' */
  plugins: [require("tailwindcss-animate")],
} satisfies Config;