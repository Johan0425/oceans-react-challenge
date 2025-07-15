
/**
 * Tailwind CSS configuration file.
 *
 * @type {import('tailwindcss').Config}
 * @property {string[]} content - Specifies the paths to all template files in the project.
 * @property {object} theme - Allows customization of the default theme.
 * @property {object} theme.extend - Provides a way to extend the default theme with custom values.
 * @property {any[]} plugins - An array to include Tailwind CSS plugins.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {},
  },
  plugins: [],
}

