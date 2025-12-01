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
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        background: {
          DEFAULT: '#111318',
          card: '#1A1C22',
        },
        text: {
          DEFAULT: '#FFFFFF',
          secondary: '#C3C4C7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

