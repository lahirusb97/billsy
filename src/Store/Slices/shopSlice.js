import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ALL_SHOPS: [],
};

export const shopSlice = createSlice({
  name: "all_shop",
  initialState,
  reducers: {
    setAllShops: (state, action) => {
      state.ALL_SHOPS = action.payload;
    },
  },
});

export const { setAllShops } = shopSlice.actions;

export default shopSlice.reducer;
