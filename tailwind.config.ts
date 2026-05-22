import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // COLOR SYSTEM - Dark Luxury Palette
      // ============================================
      colors: {
        // Background Colors - CSS Variables for theming
        background: {
          DEFAULT: "var(--background)",
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          tertiary: "var(--background-tertiary)",
          elevated: "var(--background-elevated)",
          card: "var(--background-card)",
        },
        // Surface Colors - CSS Variables for theming
        surface: {
          DEFAULT: "var(--surface)",
          primary: "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          tertiary: "var(--surface-tertiary)",
          hover: "var(--surface-hover)",
        },
        // Primary - Warm Gold/Amber
        gold: {
          DEFAULT: "#c9a962",
          50: "#f9f6ef",
          100: "#f2ecd9",
          200: "#e5d8b3",
          300: "#d8c48d",
          400: "#cbb067",
          500: "#c9a962",
          600: "#b89a58",
          700: "#a78b4e",
          800: "#967c44",
          900: "#856d3a",
        },
        // Secondary - Warm Neutral
        warm: {
          DEFAULT: "#8b7355",
          50: "#f5f2ed",
          100: "#ebe5db",
          200: "#d7cbb7",
          300: "#c3b193",
          400: "#af976f",
          500: "#8b7355",
          600: "#7d684d",
          700: "#6f5d45",
          800: "#61523d",
          900: "#534735",
        },
        // Accent - Subtle Cream
        cream: {
          DEFAULT: "#f5f0e6",
          50: "#fdfcfa",
          100: "#f5f0e6",
          200: "#ebe1cc",
          300: "#e1d2b2",
          400: "#d7c398",
          500: "#cdb47e",
        },
        // Semantic Colors
        success: {
          DEFAULT: "#5a7c5a",
          light: "#7a9c7a",
          dark: "#4a6c4a",
          muted: "#3a5c3a",
        },
        error: {
          DEFAULT: "#9c5a5a",
          light: "#bc7a7a",
          dark: "#8c4a4a",
          muted: "#7c3a3a",
        },
        warning: {
          DEFAULT: "#b89a58",
          light: "#d8ba78",
          dark: "#a88a48",
        },
        info: {
          DEFAULT: "#5a7a9c",
          light: "#7a9abc",
          dark: "#4a6a8c",
        },
        // Text Colors - CSS Variables for theming
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
        },
        // Border Colors - CSS Variables for theming
        border: {
          DEFAULT: "var(--border)",
          light: "var(--border-light)",
          dark: "var(--border-dark)",
          gold: "#c9a96240",
        },
        // shadcn/ui compatibility
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#c9a962",
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#1e1e1e",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#252525",
          foreground: "#a3a3a3",
        },
        accent: {
          DEFAULT: "#c9a962",
          foreground: "#0a0a0a",
        },
        destructive: {
          DEFAULT: "#9c5a5a",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#1e1e1e",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#252525",
          foreground: "#ffffff",
        },
        ring: "#c9a962",
        input: "#2a2a2a",
      },

      // ============================================
      // TYPOGRAPHY SYSTEM
      // ============================================
      fontFamily: {
        // Elegant Serif for Headings
        serif: [
          "Playfair Display",
          "Cormorant Garamond",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        // Clean Sans-Serif for Body
        sans: [
          "Inter",
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        // Monospace for numbers/prices
        mono: [
          "SF Mono",
          "Fira Code",
          "JetBrains Mono",
          "monospace",
        ],
      },
      fontSize: {
        // Display Sizes
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        // Heading Sizes
        "heading-xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.005em" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", letterSpacing: "0" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.45", letterSpacing: "0" }],
        "heading-xs": ["1rem", { lineHeight: "1.5", letterSpacing: "0" }],
        // Body Sizes
        "body-lg": ["1.125rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6", letterSpacing: "0" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        // Label/Caption Sizes
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
        caption: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.02em" }],
      },
      fontWeight: {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.02em",
        wider: "0.04em",
        widest: "0.08em",
      },
      lineHeight: {
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
      },

      // ============================================
      // SPACING SYSTEM
      // ============================================
      spacing: {
        "0": "0",
        "0.5": "0.125rem", // 2px
        "1": "0.25rem", // 4px
        "1.5": "0.375rem", // 6px
        "2": "0.5rem", // 8px
        "2.5": "0.625rem", // 10px
        "3": "0.75rem", // 12px
        "3.5": "0.875rem", // 14px
        "4": "1rem", // 16px
        "5": "1.25rem", // 20px
        "6": "1.5rem", // 24px
        "7": "1.75rem", // 28px
        "8": "2rem", // 32px
        "9": "2.25rem", // 36px
        "10": "2.5rem", // 40px
        "11": "2.75rem", // 44px
        "12": "3rem", // 48px
        "14": "3.5rem", // 56px
        "16": "4rem", // 64px
        "18": "4.5rem", // 72px
        "20": "5rem", // 80px
        "24": "6rem", // 96px
        "28": "7rem", // 112px
        "32": "8rem", // 128px
        "36": "9rem", // 144px
        "40": "10rem", // 160px
        "44": "11rem", // 176px
        "48": "12rem", // 192px
        "52": "13rem", // 208px
        "56": "14rem", // 224px
        "60": "15rem", // 240px
        "64": "16rem", // 256px
        "72": "18rem", // 288px
        "80": "20rem", // 320px
        "96": "24rem", // 384px
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        none: "0",
        xs: "0.125rem", // 2px
        sm: "0.25rem", // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        "2xl": "1.25rem", // 20px
        "3xl": "1.5rem", // 24px
        "4xl": "2rem", // 32px
        full: "9999px",
      },

      // ============================================
      // SHADOW SYSTEM - Premium Elevation
      // ============================================
      boxShadow: {
        none: "none",
        // Subtle shadows for dark theme
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
        DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)",
        md: "0 6px 8px -1px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.7), 0 8px 10px -6px rgba(0, 0, 0, 0.7)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        // Glow effects for gold accents
        glow: "0 0 20px rgba(201, 169, 98, 0.3)",
        "glow-lg": "0 0 40px rgba(201, 169, 98, 0.4)",
        "glow-sm": "0 0 10px rgba(201, 169, 98, 0.2)",
        // Inner shadows
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)",
        "inner-lg": "inset 0 4px 8px 0 rgba(0, 0, 0, 0.5)",
        // Card specific
        card: "0 4px 20px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.5)",
        // Elevated surfaces
        elevated: "0 8px 32px rgba(0, 0, 0, 0.6)",
        "elevated-lg": "0 16px 48px rgba(0, 0, 0, 0.7)",
      },

      // ============================================
      // ANIMATIONS & TRANSITIONS
      // ============================================
      animation: {
        // Fade animations
        "fade-in": "fadeIn 0.3s ease-out forwards",
        "fade-out": "fadeOut 0.2s ease-in forwards",
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "fade-in-down": "fadeInDown 0.4s ease-out forwards",
        // Scale animations
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "scale-out": "scaleOut 0.2s ease-in forwards",
        // Slide animations
        "slide-in-right": "slideInRight 0.3s ease-out forwards",
        "slide-in-left": "slideInLeft 0.3s ease-out forwards",
        "slide-in-up": "slideInUp 0.3s ease-out forwards",
        "slide-in-down": "slideInDown 0.3s ease-out forwards",
        // Card animations
        "card-enter": "cardEnter 0.4s ease-out forwards",
        "card-hover": "cardHover 0.3s ease-out forwards",
        // Shimmer/loading
        shimmer: "shimmer 2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        // Toast
        "toast-enter": "toastEnter 0.3s ease-out forwards",
        "toast-exit": "toastExit 0.2s ease-in forwards",
        // Modal/Dialog
        "dialog-enter": "dialogEnter 0.2s ease-out forwards",
        "dialog-exit": "dialogExit 0.15s ease-in forwards",
        // Accordion
        "accordion-down": "accordionDown 0.2s ease-out forwards",
        "accordion-up": "accordionUp 0.2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        slideInDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        cardEnter: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        cardHover: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        toastEnter: {
          "0%": { opacity: "0", transform: "translateY(-100%) scale(0.9)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        toastExit: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-100%) scale(0.9)" },
        },
        dialogEnter: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        dialogExit: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        accordionDown: {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionUp: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      transitionDuration: {
        "0": "0ms",
        "75": "75ms",
        "100": "100ms",
        "150": "150ms",
        "200": "200ms",
        "250": "250ms",
        "300": "300ms",
        "350": "350ms",
        "400": "400ms",
        "500": "500ms",
        "600": "600ms",
        "700": "700ms",
        "800": "800ms",
        "900": "900ms",
        "1000": "1000ms",
      },
      transitionTimingFunction: {
        "ease-in-sine": "cubic-bezier(0.12, 0, 0.39, 0)",
        "ease-out-sine": "cubic-bezier(0.61, 1, 0.88, 1)",
        "ease-in-out-sine": "cubic-bezier(0.37, 0, 0.63, 1)",
        "ease-in-quad": "cubic-bezier(0.11, 0, 0.5, 0)",
        "ease-out-quad": "cubic-bezier(0.5, 1, 0.89, 1)",
        "ease-in-out-quad": "cubic-bezier(0.45, 0, 0.55, 1)",
        "ease-in-cubic": "cubic-bezier(0.32, 0, 0.67, 0)",
        "ease-out-cubic": "cubic-bezier(0.33, 1, 0.68, 1)",
        "ease-in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
        "ease-in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
        "ease-out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "ease-in-out-quart": "cubic-bezier(0.76, 0, 0.24, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
        "ease-out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        luxury: "cubic-bezier(0.23, 1, 0.32, 1)",
      },

      // ============================================
      // Z-INDEX SCALE
      // ============================================
      zIndex: {
        "0": "0",
        "10": "10",
        "20": "20",
        "30": "30",
        "40": "40",
        "50": "50",
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        "modal-backdrop": "1040",
        modal: "1050",
        popover: "1060",
        tooltip: "1070",
        toast: "1080",
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        none: "0",
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "40px",
        "3xl": "64px",
      },

      // ============================================
      // OPACITY SCALE
      // ============================================
      opacity: {
        "0": "0",
        "5": "0.05",
        "10": "0.1",
        "15": "0.15",
        "20": "0.2",
        "25": "0.25",
        "30": "0.3",
        "35": "0.35",
        "40": "0.4",
        "45": "0.45",
        "50": "0.5",
        "55": "0.55",
        "60": "0.6",
        "65": "0.65",
        "70": "0.7",
        "75": "0.75",
        "80": "0.8",
        "85": "0.85",
        "90": "0.9",
        "95": "0.95",
        "100": "1",
      },

      // ============================================
      // GRADIENTS
      // ============================================
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gold-gradient": "linear-gradient(135deg, #c9a962 0%, #d4b978 50%, #c9a962 100%)",
        "gold-gradient-shine": "linear-gradient(90deg, transparent 0%, rgba(212, 185, 120, 0.4) 50%, transparent 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
        "surface-gradient": "linear-gradient(180deg, #1e1e1e 0%, #252525 100%)",
        "card-gradient": "linear-gradient(180deg, #252525 0%, #1e1e1e 100%)",
      },

      // ============================================
      // ASPECT RATIOS
      // ============================================
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
        "4/3": "4 / 3",
        "3/4": "3 / 4",
        "21/9": "21 / 9",
        "9/16": "9 / 16",
        food: "4 / 3",
        "food-tall": "3 / 4",
        banner: "21 / 9",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};

export default config;
