/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        richChocolate: '#29201f',
        ivoryWhite:'#FFFFF0',
        richChocolate800:'#634530',
        richChocolate900:'#4e3629',
      },
    },
  },
  plugins: [],
}
