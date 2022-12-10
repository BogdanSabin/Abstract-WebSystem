/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.component.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
