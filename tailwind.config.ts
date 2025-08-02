import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Liquid Glass Colors
        glass: {
          'light': 'rgba(255, 255, 255, 0.1)',
          'medium': 'rgba(255, 255, 255, 0.2)',
          'dark': 'rgba(0, 0, 0, 0.1)',
          'primary': 'rgba(99, 102, 241, 0.1)',
          'secondary': 'rgba(168, 85, 247, 0.1)',
          'accent': 'rgba(59, 130, 246, 0.1)',
        },
        // Neon Colors for highlights
        neon: {
          'pink': '#FF10F0',
          'blue': '#00D4FF',
          'green': '#39FF14',
          'purple': '#BC13FE',
          'orange': '#FF6B10',
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
        "liquid-flow": {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '33%': { transform: 'rotate(120deg) scale(1.05)' },
          '66%': { transform: 'rotate(240deg) scale(0.95)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        "glass-shine": {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        "particle-float": {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(10px) translateX(-10px)' },
          '75%': { transform: 'translateY(-15px) translateX(5px)' },
        },
        "dissolve": {
          '0%': { opacity: '1', filter: 'blur(0)' },
          '100%': { opacity: '0', filter: 'blur(20px)' },
        },
        "reveal": {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        "pulse-glow": {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(99, 102, 241, 0.4)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "liquid-flow": "liquid-flow 20s ease-in-out infinite",
        "glass-shine": "glass-shine 3s ease-in-out infinite",
        "particle-float": "particle-float 6s ease-in-out infinite",
        "dissolve": "dissolve 0.5s ease-out forwards",
        "reveal": "reveal 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
        'blur-heavy': 'blur(20px)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'liquid-gradient': 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)',
        'neon-gradient': 'linear-gradient(135deg, #FF10F0 0%, #00D4FF 50%, #39FF14 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-heavy': '0 8px 32px 0 rgba(31, 38, 135, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'neon-pink': '0 0 20px #FF10F0, 0 0 40px #FF10F0, 0 0 60px #FF10F0',
        'neon-blue': '0 0 20px #00D4FF, 0 0 40px #00D4FF, 0 0 60px #00D4FF',
      },
      blur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config