import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Template {
  REACT,
  NEXT,
  EXPRESS,
  HONO,
  ANGULAR,
  VUE,
  NULL,
}

export interface TemplateData {
  title: string;
  description: string;
  template: Template;
  icon: string;
  tags: string[];
}

const initialState: TemplateData = {
  title: "",
  description: "",
  template: Template.NULL,
  icon: "code",
  tags: [],
};

const templatedataSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    updateTemplateTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    updateTemplateDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    updateTemplateIconTemplate(
      state,
      action: PayloadAction<{
        template: Template;
        icon: string;
        tags: string[];
      }>
    ) {
      state.template = action.payload.template;
      state.icon = action.payload.icon;
      state.tags = action.payload.tags;
    },
  },
});

export const {
  updateTemplateTitle,
  updateTemplateDescription,
  updateTemplateIconTemplate,
} = templatedataSlice.actions;

export default templatedataSlice.reducer;
