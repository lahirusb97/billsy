import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  OPEN: false,
  TYPE: "sucess",
  MSG: "",
};

export const SnackBarSlice = createSlice({
  name: "snack_bar_slice",
  initialState,
  reducers: {
    openScackbar: (state, action) => {
      const { open, type, msg } = action.payload;
      state.OPEN = open;
      state.TYPE = type;
      state.MSG = msg;
    },
    closeScackbar: (state) => {
      state.OPEN = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openScackbar, closeScackbar } = SnackBarSlice.actions;

export default SnackBarSlice.reducer;
