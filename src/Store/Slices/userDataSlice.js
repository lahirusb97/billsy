import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authData: null,
  userData: null,
  selected_Shop: false,
  SHOP_LIST: [],
  CURRENT_SHOP: "",
  acess: false,
  loading: false,
  complete: false,
  error: false,
};

export const userDataSlice = createSlice({
  name: "user_data",
  initialState,
  reducers: {
    setuserData: (state, action) => {
      const { auth, user } = action.payload;
      state.userData = user;
      state.authData = auth;
      state.acess = user["Access"];
    },
    setCurrentShop: (state, action) => {  
      const { curentShop, Spswitch, shopList } = action.payload;

      state.CURRENT_SHOP = curentShop;
      state.SHOP_LIST = shopList;
      state.selected_Shop = Spswitch;
    },
    switchShop: (state) => {
      state.selected_Shop = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setuserData, setCurrentShop, switchShop } =
  userDataSlice.actions;

export default userDataSlice.reducer;
