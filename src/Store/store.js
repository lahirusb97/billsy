import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./Slices/userDataSlice";
import mainBoxSize from "./Slices/mainBoxSize";
import counterSlice from "./Slices/stockData";

export const store = configureStore({
  reducer: {
    user_data: userDataSlice,
    mainbox_width: mainBoxSize,
    stock_data: counterSlice,
  },
});
