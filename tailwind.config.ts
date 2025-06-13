import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: {
    themes: [],
    logs: false,
  },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      fontFamily: {
        matria: ["Matria", "sans-serif"],
        granado: ["Granado", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "5px",
      },
      screens: {
        mobile: { max: "1023px" },
        desktop: { min: "1024px" },
        xs: "360px",
        "2xl": "1440px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
      colors: {
        gray: {
          100: "#F6F6F6",
          200: "#D9D9D9",
          500: "#999999",
          600: "#929292",
          900: "#333333",
          950: "#1D1D1D",
        },
        green: {
          200: "#84ADA2",
          600: "#008060",
          800: "#025A44",
          950: "#004030",
        },
        yellow: {
          100: "#FBF0DF",
          200: "#F7EDD4",
          800: "#9D8D43",
        },
        purple: {
          100: "#F6F3F8",
        },
        orange: {
          400: "#FF9040",
        },
        red: {
          600: "#E02B27",
        },
      },
      animation: {
        inRight: "inRight .3s forwards",
        sliding: "sliding 30s linear infinite",
        outRight: "outRight .3s forwards",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        inRight: {
          "0%": { transform: "translateX(500px)" },
          "100%": { transform: "translateX(0)" },
        },
        outRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(500px)" },
        },
      },
      transitionDuration: {
        "240": "240ms",
      },
      backgroundImage: {
        "black-gradient":
          "linear-gradient(to top, rgba(0, 0, 0, 0.0) 0%, rgba(0, 0, 0, 1.0) 100%)",
      },
      spacing: {
        "-0.1": "-0.1rem",
        "-0.3": "-0.3rem",
      },
      boxShadow: {
        "top-shadow": "0 -3px 28px rgba(0, 0, 0, 0.16)",
      },
      width: {
        "fill-available": "-webkit-fill-available",
      },
    },
  },
};
