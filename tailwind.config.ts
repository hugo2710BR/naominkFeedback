import type { Config } from "tailwindcss";

/**
 * Mapeia os design tokens (src/styles/tokens.css, vindos de
 * naominkFeedback-design/tokens) para classes Tailwind.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nmk: {
          bg: "var(--nmk-bg)",
          "bg-deep": "oklch(0.08 0.004 60)",
          elevated: "var(--nmk-bg-elevated)",
          "elevated-2": "var(--nmk-bg-elevated-2)",
          tile: "oklch(0.2 0.008 55)",
          border: "var(--nmk-border)",
          "border-strong": "var(--nmk-border-strong)",
          rule: "oklch(1 0 0 / 0.12)",
          text: "var(--nmk-text)",
          "text-secondary": "var(--nmk-text-secondary)",
          "text-muted": "var(--nmk-text-muted)",
          "text-soft": "oklch(0.85 0.01 80)",
          accent: "var(--nmk-accent)",
          "accent-hover": "oklch(0.88 0.01 80)",
          "accent-ink": "var(--nmk-accent-ink)",
          disabled: "oklch(0.3 0.006 55)",
          danger: "var(--nmk-danger)",
          "danger-bg": "var(--nmk-danger-bg)",
          "danger-border": "var(--nmk-danger-border)",
          "danger-text": "oklch(0.86 0.06 25)",
          "danger-soft": "oklch(0.76 0.09 25)",
          "danger-tint": "oklch(0.62 0.19 25 / 0.16)",
          "danger-tint-text": "oklch(0.78 0.1 25)",
          success: "var(--nmk-success)",
          "success-tint": "oklch(0.68 0.13 150 / 0.18)",
          "success-tint-text": "oklch(0.78 0.1 150)",
          scrim: "var(--nmk-scrim)",
          "scrim-soft": "var(--nmk-scrim-soft)",
          "scrim-btn": "oklch(0.04 0 0 / 0.6)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        ui: ["var(--font-jost)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      borderRadius: {
        input: "var(--nmk-radius-input)",
        tile: "var(--nmk-radius-tile)",
        photo: "var(--nmk-radius-photo)",
        card: "var(--nmk-radius-card)",
        modal: "var(--nmk-radius-modal)",
        sheet: "var(--nmk-radius-sheet-top)",
      },
      boxShadow: {
        elevated: "var(--nmk-shadow-elevated)",
        modal: "var(--nmk-shadow-modal)",
        sheet: "0 -20px 60px -20px oklch(0 0 0 / 0.8)",
        fab: "0 12px 30px -8px oklch(0 0 0 / 0.6)",
      },
      maxWidth: {
        page: "var(--nmk-max-width)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        tileIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        springIn: {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        skeleton: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out both",
        tileIn: "tileIn 0.4s ease-out both",
        splashIn: "fadeIn 0.4s ease-out both",
        splashOut: "fadeOut 0.5s ease-in both",
        modalIn: "fadeIn 0.25s ease both",
        springIn: "springIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        fadeOut: "fadeOut 0.4s ease-in both",
        skeleton: "skeleton 1.4s ease-in-out infinite",
        spinner: "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
