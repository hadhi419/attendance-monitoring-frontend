/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // adjust according to your project
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'custom-pink': '#5b0048',
      },
    },
  },
  plugins: [],
}
