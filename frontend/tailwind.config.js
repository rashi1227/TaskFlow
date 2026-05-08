/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E293B",
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#1E293B",
          900: "#0F172A",
        },
        accent: {
          DEFAULT: "#6366F1",
          light: "#818CF8",
          dark: "#4F46E5",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          dim: "#F1F5F9",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
        slate: {
          650: "#475569",
        },
        success: {
          light: "#ECFDF5",
          DEFAULT: "#10B981",
          dark: "#065F46",
        },
        warning: {
          light: "#FFFBEB",
          DEFAULT: "#F59E0B",
          dark: "#92400E",
        },
        danger: {
          light: "#FEF2F2",
          DEFAULT: "#EF4444",
          dark: "#991B1B",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'nav': '0px 1px 3px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}
