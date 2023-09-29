import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  open: false,
  edit: false,
};

export const itemEditSlice = createSlice({
  name: "edit_item",
  initialState,
  reducers: {
    setOpen: (state, action) => {
      const { edit, key2 } = action.payload;
      state.open = edit;
      state.edit = key2;
    },

    getData: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { getData, setOpen, setEdit } = itemEditSlice.actions;

export default itemEditSlice.reducer;
