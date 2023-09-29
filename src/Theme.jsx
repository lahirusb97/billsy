"use client";
import { createTheme } from "@mui/material";
import { blue, orange } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: "#306CE9",
      light: "#698AED",
      dark: "#0F1D4A",
      iconcolor: "#454655",
      contrastText: "#fff",
      bglite: "#F5F5F5",
      subtitle: "#8C8EA6",
    },
  },

  customTextField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px 10px 30px 5px", // Example radii for each corner
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "mainbtn" },
          style: {
            textTransform: "capitalize",
            background: "#0F1D4A",
            color: "#fff",
            "&:hover": {
              background: "#0F1D4A",
            },
          },
        },
      ],
    },
  },
  status: {
    danger: orange[500],
  },
});
export default theme;
