/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171F",
        muted: "#6B7280",
        faint: "#9CA3AF",
        line: "#E5E7EB",
        surface: "#FAFAF9",
        accent: {
          DEFAULT: "#0F6B4C",
          soft: "#E6F4EE",
          dark: "#0B4E38",
        },
        amber: {
          DEFAULT: "#B4690E",
          soft: "#FBF0E4",
        },
      },
      fontFamily: {
        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.2rem" }],
      },
    },
  },
  plugins: [],
};
