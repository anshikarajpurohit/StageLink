/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theatre: {
          teal: '#0F3D3E',
          gold: '#FFC94A',
          coral: '#FF6B4A',
          pink: '#FFB4C2',
          black: '#1A1A1A',
          offwhite: '#F5F0E6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
      },
      boxShadow: {
        'solid-coral': '4px 4px 0px 0px #FF6B4A',
        'solid-gold': '4px 4px 0px 0px #FFC94A',
        'solid-black': '4px 4px 0px 0px #1A1A1A',
      }
    },
  },
  plugins: [],
}
