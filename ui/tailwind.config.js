export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  safelist: [
    {pattern: /(active:|hover:)?bg-.+-.+/},
    {pattern: /text-.+/},

  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

