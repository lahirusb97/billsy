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
import switchShop from "./Slices/switchShop";
import navWidth from "./Slices/Component/navWidth";
import setAllShops from "./Slices/shopSlice";
import itemEditSlice from "./Slices/itemEditSlice";

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
    switch_shop: switchShop,
    nav_width: navWidth,
    all_shop: setAllShops,
    edit_item: itemEditSlice,
  },
});
