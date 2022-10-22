const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: {
    enabled: process.env.HUGO_ENVIRONMENT === 'production',
    content: [
      './layouts/**/*.html',
      './content/**/*.md',
      './content/**/*.html',
      './content/**/*.js',
      './assets/js/*.js',
      './_vendor/**/*.html'
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
    },
    extend: {
      colors: {
        'tml-blue': '#2696a8',
        'teal-100': '#e6fffa',
        'teal-200': '#b2f5ea',
        'teal-700': '#2c7a7b',
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
  ],
}
