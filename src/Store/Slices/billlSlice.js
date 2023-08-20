import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  BILLHISTORY: [],
  OPENED_BILL: null,
  OPEN_MODAL: false,
};

export const billSlice = createSlice({
  name: "bill_data",
  initialState,
  reducers: {
    billHistory: (state, action) => {
      state.BILLHISTORY = action.payload;
    },
    openclose: (state, action) => {
      state.OPEN_MODAL = action.payload;
    },
    openedbill: (state, action) => {
      state.OPENED_BILL = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openclose, billHistory, openedbill } = billSlice.actions;

export default billSlice.reducer;
