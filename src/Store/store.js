import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./Slices/userDataSlice";
export const store = configureStore({
  reducer: {
    user_data: userDataSlice,
  },
});
