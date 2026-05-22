/**
 * ============================================
 * LUXURY FOOD DELIVERY - DESIGN TOKENS
 * Premium Dark Luxury Design System
 * ============================================
 * 
 * This file contains all design tokens for the application.
 * Use these tokens to maintain consistency across the UI.
 */

// ============================================
// COLOR TOKENS
// ============================================

export const colors = {
  // Background Colors - Deep Charcoal Scale
  background: {
    DEFAULT: "#0a0a0a",
    primary: "#0a0a0a",
    secondary: "#111111",
    tertiary: "#1a1a1a",
    elevated: "#1e1e1e",
    card: "#252525",
  },

  // Surface Colors - Elevated Dark
  surface: {
    DEFAULT: "#1e1e1e",
    primary: "#1e1e1e",
    secondary: "#252525",
    tertiary: "#2a2a2a",
    hover: "#303030",
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

  // Text Colors
  text: {
    primary: "#ffffff",
    secondary: "#d4d4d4",
    tertiary: "#a3a3a3",
    muted: "#737373",
    disabled: "#525252",
  },

  // Border Colors
  border: {
    DEFAULT: "#2a2a2a",
    light: "#3a3a3a",
    dark: "#1a1a1a",
    gold: "rgba(201, 169, 98, 0.25)",
  },
} as const;

// ============================================
// TYPOGRAPHY TOKENS
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    serif: ["Playfair Display", "Cormorant Garamond", "Georgia", "Times New Roman", "serif"],
    sans: ["Inter", "SF Pro Display", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
    mono: ["SF Mono", "Fira Code", "JetBrains Mono", "monospace"],
  },

  // Font Sizes with Line Heights
  fontSize: {
    // Display Sizes
    "display-xl": { size: "4.5rem", lineHeight: "1.1", letterSpacing: "-0.02em" },
    "display-lg": { size: "3.5rem", lineHeight: "1.15", letterSpacing: "-0.02em" },
    "display-md": { size: "2.5rem", lineHeight: "1.2", letterSpacing: "-0.01em" },
    "display-sm": { size: "2rem", lineHeight: "1.25", letterSpacing: "-0.01em" },

    // Heading Sizes
    "heading-xl": { size: "1.875rem", lineHeight: "1.3", letterSpacing: "-0.01em" },
    "heading-lg": { size: "1.5rem", lineHeight: "1.35", letterSpacing: "-0.005em" },
    "heading-md": { size: "1.25rem", lineHeight: "1.4", letterSpacing: "0" },
    "heading-sm": { size: "1.125rem", lineHeight: "1.45", letterSpacing: "0" },
    "heading-xs": { size: "1rem", lineHeight: "1.5", letterSpacing: "0" },

    // Body Sizes
    "body-lg": { size: "1.125rem", lineHeight: "1.6", letterSpacing: "0" },
    "body-md": { size: "1rem", lineHeight: "1.6", letterSpacing: "0" },
    "body-sm": { size: "0.875rem", lineHeight: "1.6", letterSpacing: "0" },
    "body-xs": { size: "0.75rem", lineHeight: "1.5", letterSpacing: "0.01em" },

    // Label/Caption Sizes
    label: { size: "0.75rem", lineHeight: "1.4", letterSpacing: "0.02em" },
    caption: { size: "0.6875rem", lineHeight: "1.4", letterSpacing: "0.02em" },
  },

  // Font Weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.04em",
    widest: "0.08em",
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
} as const;

// ============================================
// SPACING TOKENS
// ============================================

export const spacing = {
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
} as const;

// ============================================
// BORDER RADIUS TOKENS
// ============================================

export const borderRadius = {
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
} as const;

// ============================================
// SHADOW TOKENS
// ============================================

export const shadows = {
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
} as const;

// ============================================
// TRANSITION TOKENS
// ============================================

export const transitions = {
  // Duration
  duration: {
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

  // Timing Functions
  timing: {
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

  // Preset Transitions
  presets: {
    fast: "150ms cubic-bezier(0.23, 1, 0.32, 1)",
    base: "250ms cubic-bezier(0.23, 1, 0.32, 1)",
    slow: "350ms cubic-bezier(0.23, 1, 0.32, 1)",
    luxury: "400ms cubic-bezier(0.23, 1, 0.32, 1)",
    colors: "color 250ms cubic-bezier(0.23, 1, 0.32, 1)",
    transform: "transform 250ms cubic-bezier(0.23, 1, 0.32, 1)",
    opacity: "opacity 250ms cubic-bezier(0.23, 1, 0.32, 1)",
    all: "all 250ms cubic-bezier(0.23, 1, 0.32, 1)",
  },
} as const;

// ============================================
// Z-INDEX TOKENS
// ============================================

export const zIndex = {
  "0": 0,
  "10": 10,
  "20": 20,
  "30": 30,
  "40": 40,
  "50": 50,
  "60": 60,
  "70": 70,
  "80": 80,
  "90": 90,
  "100": 100,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================
// BREAKPOINT TOKENS
// ============================================

export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// ============================================
// OPACITY TOKENS
// ============================================

export const opacity = {
  "0": 0,
  "5": 0.05,
  "10": 0.1,
  "15": 0.15,
  "20": 0.2,
  "25": 0.25,
  "30": 0.3,
  "35": 0.35,
  "40": 0.4,
  "45": 0.45,
  "50": 0.5,
  "55": 0.55,
  "60": 0.6,
  "65": 0.65,
  "70": 0.7,
  "75": 0.75,
  "80": 0.8,
  "85": 0.85,
  "90": 0.9,
  "95": 0.95,
  "100": 1,
} as const;

// ============================================
// GRADIENT TOKENS
// ============================================

export const gradients = {
  gold: "linear-gradient(135deg, #c9a962 0%, #d4b978 50%, #c9a962 100%)",
  goldShine: "linear-gradient(90deg, transparent 0%, rgba(212, 185, 120, 0.4) 50%, transparent 100%)",
  dark: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
  surface: "linear-gradient(180deg, #1e1e1e 0%, #252525 100%)",
  card: "linear-gradient(180deg, #252525 0%, #1e1e1e 100%)",
  overlay: "linear-gradient(180deg, transparent 0%, rgba(10, 10, 10, 0.8) 100%)",
  overlayReverse: "linear-gradient(0deg, transparent 0%, rgba(10, 10, 10, 0.8) 100%)",
} as const;

// ============================================
// ASPECT RATIO TOKENS
// ============================================

export const aspectRatios = {
  auto: "auto",
  square: "1 / 1",
  video: "16 / 9",
  "4/3": "4 / 3",
  "3/4": "3 / 4",
  "21/9": "21 / 9",
  "9/16": "9 / 16",
  food: "4 / 3",
  foodTall: "3 / 4",
  banner: "21 / 9",
} as const;

// ============================================
// COMPONENT-SPECIFIC TOKENS
// ============================================

export const components = {
  // Button Tokens
  button: {
    padding: {
      sm: `${spacing["2"]} ${spacing["3"]}`,
      DEFAULT: `${spacing["2.5"]} ${spacing["4"]}}`,
      lg: `${spacing["3"]} ${spacing["6"]}}`,
    },
    height: {
      sm: "2rem",
      DEFAULT: "2.5rem",
      lg: "3rem",
    },
    borderRadius: borderRadius.lg,
  },

  // Card Tokens
  card: {
    padding: {
      sm: spacing["3"],
      DEFAULT: spacing["4"],
      lg: spacing["6"],
    },
    borderRadius: {
      sm: borderRadius.md,
      DEFAULT: borderRadius.xl,
      lg: borderRadius["2xl"],
    },
  },

  // Input Tokens
  input: {
    height: {
      sm: "2rem",
      DEFAULT: "2.75rem",
      lg: "3.25rem",
    },
    padding: {
      sm: `${spacing["1.5"]} ${spacing["2"]}}`,
      DEFAULT: `${spacing["2.5"]} ${spacing["4"]}}`,
      lg: `${spacing["3"]} ${spacing["4"]}}`,
    },
    borderRadius: borderRadius.lg,
  },

  // Badge Tokens
  badge: {
    padding: {
      sm: `${spacing["0.5"]} ${spacing["1.5"]}}`,
      DEFAULT: `${spacing["1"]} ${spacing["2"]}}`,
    },
    borderRadius: borderRadius.full,
  },

  // Avatar Tokens
  avatar: {
    size: {
      xs: "1.5rem",
      sm: "2rem",
      DEFAULT: "2.5rem",
      lg: "3.5rem",
      xl: "4.5rem",
    },
    borderRadius: borderRadius.full,
  },
} as const;

// ============================================
// ANIMATION TOKENS
// ============================================

export const animations = {
  // Fade Animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: transitions.timing.luxury },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.4, ease: transitions.timing.luxury },
  },

  // Scale Animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },

  // Slide Animations
  slideInRight: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },
  slideInLeft: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },
  slideInUp: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },
  slideInDown: {
    initial: { y: "-100%" },
    animate: { y: 0 },
    exit: { y: "-100%" },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },

  // Card Animations
  cardEnter: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
    transition: { duration: 0.4, ease: transitions.timing.luxury },
  },
  cardHover: {
    initial: { y: 0 },
    animate: { y: -4 },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },

  // Toast Animations
  toastEnter: {
    initial: { opacity: 0, y: -100, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -100, scale: 0.9 },
    transition: { duration: 0.3, ease: transitions.timing.luxury },
  },

  // Dialog Animations
  dialogEnter: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: transitions.timing.luxury },
  },
} as const;

// ============================================
// ALL TOKENS EXPORT
// ============================================

export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  opacity,
  gradients,
  aspectRatios,
  components,
  animations,
} as const;

// Type exports for TypeScript
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
export type Transitions = typeof transitions;
export type ZIndex = typeof zIndex;
export type Breakpoints = typeof breakpoints;
export type Opacity = typeof opacity;
export type Gradients = typeof gradients;
export type AspectRatios = typeof aspectRatios;
export type Components = typeof components;
export type Animations = typeof animations;
export type Tokens = typeof tokens;

export default tokens;
