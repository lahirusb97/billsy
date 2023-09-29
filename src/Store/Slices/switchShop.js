import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 
  LOADING: false,

 
};

export const switchShop = createSlice({
  name: "switch_shop",
  initialState,
  reducers: {
    changeShop: (state, action) => {
      state.CATEGORY_DATA = action.payload;
    },
 
  },
});

// Action creators are generated for each case reducer function
export const { changeShop } =
switchShop.actions;

export default switchShop.reducer;
