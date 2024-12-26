/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivoryWhite:'#FFFFF0',
        ivoryWhite200:'#fdfd8a',
        ivoryWhite600:'#d9a106',
        ivoryWhite500:'#f5cd0b',
        richChocolate: '#29201f',
        richChocolate100: '#e5e2dc',
        richChocolate200: '#cec4ba',
        richChocolate300: '#b1a293',
        richChocolate400: '#9b8674',
        richChocolate500: '#8c7666',
        richChocolate600: '#786256',
        richChocolate700: '#614d47',
        richChocolate800:'#634530',
        richChocolate900:'#4e3629',
        richChocolate600:'#9b8674',

        neroBlack950:'#262626',
        neroBlack500:'#6d6d6d',
        neroBlack900:'#3d3d3d',
        customWhite:'#f3f2ef',
        customWhite2:'#f8f8f8',
        customYellow:'#f8ba4d'
      },
    },
  },
  plugins: [],
}
