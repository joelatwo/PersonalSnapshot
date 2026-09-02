import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import HomePage from "./app/page";
import "./app/globals.css";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  </React.StrictMode>,
);
