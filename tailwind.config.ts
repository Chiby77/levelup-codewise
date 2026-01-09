
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(152 76% 36%)",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(168 76% 30%)",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "hsl(160 84% 39%)",
          foreground: "#FFFFFF",
        },
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
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        gradientShift: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gradientRotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0.7)" },
          "70%": { boxShadow: "0 0 0 15px rgba(249, 115, 22, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(249, 115, 22, 0)" },
        },
        neonPulse: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(262.1 83.3% 57.8% / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(262.1 83.3% 57.8% / 0.8), 0 0 60px hsl(262.1 83.3% 57.8% / 0.4)" },
        },
        cyberGlow: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(180 100% 50% / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(180 100% 50% / 0.8), 0 0 80px hsl(180 100% 50% / 0.3)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        floatLarge: {
          "0%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(1deg)" },
          "66%": { transform: "translateY(-5px) rotate(-1deg)" },
          "100%": { transform: "translateY(0px) rotate(0deg)" },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -30px, 0)" },
          "70%": { transform: "translate3d(0, -15px, 0)" },
          "90%": { transform: "translate3d(0, -4px, 0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        morphing: {
          "0%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
          "100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
        },
        glitch: {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out forwards",
        slideUp: "slideUp 0.6s ease-out forwards",
        slideDown: "slideDown 0.6s ease-out forwards",
        slideLeft: "slideLeft 0.6s ease-out forwards",
        slideRight: "slideRight 0.6s ease-out forwards",
        scaleIn: "scaleIn 0.5s ease-out forwards",
        gradientShift: "gradientShift 8s ease infinite",
        gradientRotate: "gradientRotate 10s linear infinite",
        pulse: "pulse 2s infinite",
        neonPulse: "neonPulse 2s ease-in-out infinite",
        cyberGlow: "cyberGlow 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        floatLarge: "floatLarge 6s ease-in-out infinite",
        spin: "spin 10s linear infinite",
        spinSlow: "spinSlow 20s linear infinite",
        bounce: "bounce 2s infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out infinite",
        morphing: "morphing 8s ease-in-out infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
