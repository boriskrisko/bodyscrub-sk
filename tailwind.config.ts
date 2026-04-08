import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        moss: {
          50: '#F0F5EE',
          100: '#D9E8D4',
          200: '#B5D1A8',
          400: '#6D9B5E',
          600: '#4A6741',
          800: '#2E4229',
          900: '#1A2B17',
        },
        plum: {
          50: '#F3EEF5',
          100: '#E0D4E6',
          200: '#C4A9CC',
          400: '#8E6A9E',
          600: '#6B4D7A',
          800: '#45304F',
          900: '#2A1D30',
        },
        sand: {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#E8DCC8',
          400: '#C4A97D',
          600: '#8B7355',
          800: '#5C4A30',
        },
        ink: '#1C1C1C',
      },
      fontFamily: {
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};
export default config;
