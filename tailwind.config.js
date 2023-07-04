/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    
    extend: {
      screens: {
        'xl':'1440px'
      },
      colors:{
        navColor:"#373B53",
        
      },
      gradientColorStops: {
        'gradient-1': 'rgba(0, 0, 0, 0.0001)',
        'gradient-2': 'rgba(0, 0, 0, 0.1)',
      },
      boxShadow: {
        'custom': '0px 10px 10px -10px rgba(72, 84, 159, 0.100397)',
        'filter':"0px 10px 20px rgba(72, 84, 159, 0.25)",
        'darkFilter': "0px 10px 20px rgba(0, 0, 0, 0.25)",
        'term':'0px 10px 20px rgba(72, 84, 159, 0.25)',
        'delete':'0px 10px 10px -10px rgba(72, 84, 159, 0.100397)'
      },
    },
  },
  plugins: [],
}
