import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authData: null,
  userData: null,
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
    },
  },
});

// Action creators are generated for each case reducer function
export const { setuserData } = userDataSlice.actions;

export default userDataSlice.reducer;
