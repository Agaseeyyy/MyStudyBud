/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        myPallet: {
          100: '#A0D683',
          200: '#72BF78',
        },
        light: '#fdfff5',
        bl: '#24252C',
      },
      fontFamily: {
        LexendDecaRegular: ['LexendDeca-Regular'],
        LexendDecaMedium: ['LexendDeca-Medium'],
        LexendDecaSemiBold: ['LexendDeca-SemiBold'],
        LexendDecaBold: ['LexendDeca-Bold'],
        LexendDecaBlack: ['LexendDeca-Black'],

      },
    },
  },
  plugins: [],
}

