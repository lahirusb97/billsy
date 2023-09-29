import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  NAV_WIDTH: 0,
};

export const navWidth = createSlice({
  name: "nav_width",
  initialState,
  reducers: {
    setnavWidth: (state, action) => {
      state.NAV_WIDTH = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setnavWidth } = navWidth.actions;

export default navWidth.reducer;
