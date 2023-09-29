/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      mycreamlite: "#FFF1E6",
      mycreamdark: "#ECC8A4",
      mygraylite: "#C5C5C5",
      mymainbg: "#F5F4F7",
      mygraydark: "#6C6C6C",
      mygreen: "#3FD1AE",
      myblue: "#3F5FD1",
      myred: "#D13F43",
      myredlite: "#F68689",
      mybluedark: "#081226",
      //
      mywhite: "#ffffff",
      black: "#1D1D1D",
      //blue
      bluedark: "#131729",
      blue: "#6D7BE3",
      bluelite: "#E1E9FF",
      //green
      greendark: "#288F60",
      greenlite: "#D2FAE0",
      //red
      red: "#E95D56",
      redlite: "#FFE3E4",
      //purple
      purple: "#7F55DA",
      purplelite: "#ECE3FF",
      //Gray
      grayLite: "#E6E6E6",
      grayLite2: "#8C8EA6",
    },
    borderRadius: {
      borderinput: "20px",
    },
  },
  plugins: [
    require("@headlessui/tailwindcss"),

    // Or with a custom prefix:
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
  ],
};
