module.exports = {
  content: [
    "./*.{html,js}",
    "./assets/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin")({
      datatables: true,
    }),
  ],
};
