/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#10b981",
        dark: "#1f2937",
        light: "#f9fafb",
        accent: "#8b5cf6",
      },
    },
  },
  plugins: [],
  corePlugins: {
    opacity: true,
  },
  safelist: [
    'hover:bg-primary/90',
    'hover:bg-secondary/90',
  ]
} 