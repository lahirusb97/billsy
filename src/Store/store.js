import { configureStore } from "@reduxjs/toolkit";
import userDataSlice from "./Slices/userDataSlice";
import mainBoxSize from "./Slices/mainBoxSize";
import counterSlice from "./Slices/stockData";
import SnackBarSlice from "./Slices/SnackBarSlice";
import confirmModal from "./Slices/Component/confirmModal";
import InvoiceSlice from "./Slices/InvoiceSlice";
import coustomerData from "./Slices/CoustomerData";
import shopData from "./Slices/shopData";
import billSlice from "./Slices/billlSlice";

export const store = configureStore({
  reducer: {
    user_data: userDataSlice,
    mainbox_width: mainBoxSize,
    stock_data: counterSlice,
    snack_bar_slice: SnackBarSlice,
    confirm_modal_slice: confirmModal,
    invoice_data: InvoiceSlice,
    coustomer_data: coustomerData,
    shop_data: shopData,
    bill_data: billSlice,
  },
});
