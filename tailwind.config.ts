import type { Config } from "tailwindcss";
import daisyui from 'daisyui'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        amarillo: '#F5D415', 
        azuloscuro: '#2D3277', 
        celeste: '#3483FA',
        rojo: '#E60002',
        verde: '#02A64F',
        gris: '#EDEDED'
      },
    },
  },
  plugins: [daisyui],
};

export default config;