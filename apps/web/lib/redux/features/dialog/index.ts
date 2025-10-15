import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DialogState = {
  isOpen: boolean;
};

let initialState: DialogState = {
  isOpen: false,
};

const dialogStateSlice = createSlice({
  name: "dialogstate",
  initialState,
  reducers: {
    updateDialogState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { updateDialogState } = dialogStateSlice.actions;
export default dialogStateSlice.reducer;
