import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bakery: {
          light: '#FFFDF9',     // Warm cream background
          sand: '#F5EBE0',      // Soft flour sand
          tan: '#E3D5CA',       // Light toast
          milk: '#D5C3B2',      // Milk tea
          chocolate: '#3E2723',  // Dark rich chocolate accent
          amber: '#D97706',      // Warm honey amber
          amberDark: '#B45309',  // Deep amber
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
