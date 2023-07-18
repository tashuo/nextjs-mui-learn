/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./pages/*.{tsx, ts}",
      "./src/*.{tsx, ts}",
  ],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

