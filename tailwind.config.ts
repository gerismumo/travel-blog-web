import type { Config } from "tailwindcss";

const colors = require('tailwindcss/colors')
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'white' : '#ffffff',
      'darkBlue' : '#30475E',
      'dark': '#121212',
      'lightRed':'#FF5F5F',
      'lightGrey': '#F5F5F5',
      'grey': 'grey',
      ...colors,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
