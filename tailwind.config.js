module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        tiny: '.95rem',
      },
      minWidth: {
        0: '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        table: '1300px',
        'table-md': '900px',
        full: '100%',
      },
      maxWidth: {
        desc: '25rem',
        title: '15rem',
      },
      width: {
        128: '25rem',
      },
      maxHeight: {
        '75vh': '85vh',
        'evt-table': '300px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
