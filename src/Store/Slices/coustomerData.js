import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  COUSTOMER_DATA: [],
  COUSTOMER_DATA_DOC: [],
  DATA_LOAD: false,
};

export const coustomerData = createSlice({
  name: "coustomer_data",
  initialState,
  reducers: {
    addCustomerData: (state, action) => {
      state.COUSTOMER_DATA = action.payload;
    },
    addCustomerDocData: (state, action) => {
      state.COUSTOMER_DATA_DOC = action.payload;
      state.DATA_LOAD = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addCustomerData, addCustomerDocData } = coustomerData.actions;

export default coustomerData.reducer;
