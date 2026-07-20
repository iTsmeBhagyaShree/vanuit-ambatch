/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3E4E36',    // Forest Green – Brandbook Hoofd kleur
        secondary: '#C4BEB3',  // Slightly darker Warm Beige for borders/accents
        accent: '#70624F',     // Wood Brown – Brandbook Sub kleur
        dark: '#4A4A43',       // Dark Gray – Brandbook Sub kleur
        light: '#D6CFC2',      // Warm Beige – Page background (replaces off-white)
        cream: '#EDE8DF',      // Warm Cream – Card/Input backgrounds
        'cream-dark': '#C4BEB3', // Borders
      },
      fontFamily: {
        heading: ['Ragna', 'Georgia', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 16px rgba(62, 78, 54, 0.05)',
        card: '0 4px 24px rgba(62, 78, 54, 0.08)',
        'card-hover': '0 8px 32px rgba(62, 78, 54, 0.12)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
