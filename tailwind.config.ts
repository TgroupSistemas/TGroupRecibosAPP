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
      width: {
        '7/10': '30%',
      },
      colors: {
        amarillo: '#F5D415', 
        azuloscuro: '#2D3277', 
        celeste: '#3483FA',
        rojo: '#E60002',
        verde: '#02A64F',
        gris: '#EDEDED',
        verdegris: '#41928b',
        grisclaro: '#50bbb0',
        grisclaro2: '#47a79d',
      },
    },
  },
  plugins: [daisyui],
};

export default config;