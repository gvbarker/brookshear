/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important:"#root",
  theme: {
    extend: {
      backgroundColor: {
        "black-transp-half" : "rgba(0,0,0,0.5)",
        "layout-d-blue" : "rgb(3,0,46)",
        "foreground-blue" : "rgb(2,0,108)",
        "highlight-blue" : "rgb(9,0,126)",
      },
      
    },
  },
  plugins: [],
};
