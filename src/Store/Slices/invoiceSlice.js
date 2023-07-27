import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  INVOICE_SEARCH_ITEMS: [],
  INVOICE_ITEMS: [],
  TOTAL_PRICE: 0,
};

export const invoiceSlice = createSlice({
  name: "invoice_data",
  initialState,
  reducers: {
    searchInvoiceItems: (state, action) => {
      state.INVOICE_SEARCH_ITEMS = action.payload;
    },
    addItem: (state, action) => {
      state.INVOICE_ITEMS = [...state.INVOICE_ITEMS, action.payload];
      state.TOTAL_PRICE += action.payload["Price"];
    },
    addQty: (state, action) => {
      state.INVOICE_ITEMS[action.payload]["Qty"] =
        state.INVOICE_ITEMS[action.payload]["Qty"] + 1;

      state.INVOICE_ITEMS[action.payload]["Price"] +=
        state.INVOICE_ITEMS[action.payload]["UnitPrice"];

      state.TOTAL_PRICE += state.INVOICE_ITEMS[action.payload]["UnitPrice"];
    },
    removeQty: (state, action) => {
      state.INVOICE_ITEMS[action.payload]["Qty"] =
        state.INVOICE_ITEMS[action.payload]["Qty"] - 1;

      state.INVOICE_ITEMS[action.payload]["Price"] -=
        state.INVOICE_ITEMS[action.payload]["UnitPrice"];
      state.TOTAL_PRICE -= state.INVOICE_ITEMS[action.payload]["UnitPrice"];
    },
    removeItem: (state, action) => {
      state.TOTAL_PRICE =
        state.TOTAL_PRICE - state.INVOICE_ITEMS[action.payload]["Price"];

      state.INVOICE_ITEMS.splice(action.payload, 1);
    },
    clearAll: (state) => {
      state.TOTAL_PRICE = 0;
      state.INVOICE_ITEMS = [];
      state.INVOICE_SEARCH_ITEMS = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  searchInvoiceItems,
  addItem,
  addQty,
  removeQty,
  removeItem,
  clearAll,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
