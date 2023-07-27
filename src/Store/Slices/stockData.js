import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Data: false,
  CATEGORY_DATA: null,

  ALL_STOCKS: [],
  FILTER_STOCK: [],
  INVOICE_TABLE_DATA: [],
};

export const stockData = createSlice({
  name: "stock_data",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.CATEGORY_DATA = action.payload;
    },
    setStock: (state, action) => {
      state.ALL_STOCKS = action.payload;
    },
    stockFilter: (state, action) => {
      state.FILTER_STOCK = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCategory, setStock, stockFilter, setCategoryChange } =
  stockData.actions;

export default stockData.reducer;
