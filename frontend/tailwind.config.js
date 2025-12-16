/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC143C',
          dark: '#8B2A9E',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #DC143C 0%, #8B2A9E 100%)',
      },
    },
  },
  plugins: [],
}
