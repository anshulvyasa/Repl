import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateFolder } from "@repo/zod/files";

export type TemplatePlayground = {
  playgroundId: string;
  files: TemplateFolder;
};

const initialState: TemplatePlayground = {
  playgroundId: "",
  files: {
    folderName: "",
    items: [],
  },
};

const playgroundTemplateFiles = createSlice({
  name: "playgroundTemplateSlice",
  initialState,
  reducers: {
    addPlaygroundTemplateFiles(state, action: PayloadAction<TemplateFolder>) {
      state.files = action.payload;
    },
  },
});

export const { addPlaygroundTemplateFiles } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;
