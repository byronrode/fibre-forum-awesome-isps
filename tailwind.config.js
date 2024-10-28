module.exports = {
  content: [
    "./*.{html,js}",
    "./assets/**/*.{html,js}",
    "./src/**/*.{html,js,css}",
    "./node_modules/flowbite/**/*.js",
  ],
  safelist: [
    "badge",
    "badge-success",
    "badge-warning",
    "badge-danger",
    "datatable-wrapper",
    "datatable-input",
    "datatable-selector",
    "datatable-pagination",
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
