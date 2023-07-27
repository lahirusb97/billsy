import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  COUSTOMER_DATA: [],
};

export const coustomerData = createSlice({
  name: "coustomer_data",
  initialState,
  reducers: {
    addCustomerData: (state, action) => {
      state.COUSTOMER_DATA = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCustomerData } = coustomerData.actions;

export default coustomerData.reducer;
