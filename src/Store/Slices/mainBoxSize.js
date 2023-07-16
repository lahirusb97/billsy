import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  width: null,
};

export const mainBoxSize = createSlice({
  name: "mainbox_width",
  initialState,
  reducers: {
    setWidth: (state, action) => {
      state.width = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWidth } = mainBoxSize.actions;

export default mainBoxSize.reducer;
