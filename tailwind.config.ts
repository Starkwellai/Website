import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#73A5B5',
          dark: '#5c8491',
          light: '#8ac6d9',
          50: '#f0f7f9',
          100: '#d9e8ed',
          200: '#b8d3dc',
          300: '#8ab5c4',
          400: '#73a5b5',
          500: '#5c8491',
          600: '#4d6f7a',
          700: '#415c65',
          800: '#3a4e55',
          900: '#344248',
        },
      },
    },
  },
  plugins: [],
}
export default config

