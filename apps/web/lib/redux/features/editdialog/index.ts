import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EditPlaygroundDataDialogProps {
  isOpen: boolean;
}

const initialState: EditPlaygroundDataDialogProps = {
  isOpen: false,
};

const editPlaygroundDataSlice = createSlice({
  name: "editPlaygroundDataSlice",
  initialState,
  reducers: {
    changeEditPlaygroundDialogState(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
  },
});

export const { changeEditPlaygroundDialogState } =
  editPlaygroundDataSlice.actions;
export default editPlaygroundDataSlice.reducer;
