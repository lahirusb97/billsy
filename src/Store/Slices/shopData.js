import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SHOP_LIST: [],
  SELECTED_SHOP: [],
};

export const shopData = createSlice({
  name: "shop_data",
  initialState,
  reducers: {
    shopselect: (state, action) => {
      state.SELECTED_SHOP = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { shopselect } = shopData.actions;

export default shopData.reducer;
