import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Store/store.js";
import { BrowserRouter } from "react-router-dom";

import theme from "./Theme.jsx";
import { ThemeProvider } from "@emotion/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <ThemeProvider theme={theme}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
