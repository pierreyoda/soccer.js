module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
    require('@fullhuman/postcss-purgecss')({
      content: [
        "./public/**/*.html",
        "./src/**/*.vue",
      ],
    }),
  ],
};
