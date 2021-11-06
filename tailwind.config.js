module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minWidth: {
      '0': '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      'table': '1536px',
      'table-md': '900px',
      'full': '100%',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
