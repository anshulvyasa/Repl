import { TemplateOption } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedTemplateData {
  name: string | null;
  template: TemplateOption | null;
}

const initialState: SelectedTemplateData = {
  name: null,
  template: null,
};

const selectedSliceData = createSlice({
  name: "selectedTemplateData",
  initialState,
  reducers: {
    updateSelectedTemplateProjectName(state, action: PayloadAction<string|null>) {
      state.name = action.payload;
    },
    updateSelectedTemplate(state, action: PayloadAction<TemplateOption|null>) {
      state.template = action.payload;
    },
  },
});

export const { updateSelectedTemplateProjectName, updateSelectedTemplate } =
  selectedSliceData.actions;
export default selectedSliceData.reducer;
