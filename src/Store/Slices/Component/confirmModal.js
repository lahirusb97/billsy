import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  OPEN: false,
};

export const confirmModal = createSlice({
  name: "confirm_modal_slice",
  initialState,
  reducers: {
    openModal: (state) => {
      state.OPEN = true;
    },
    closeModal: (state) => {
      state.OPEN = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = confirmModal.actions;

export default confirmModal.reducer;
