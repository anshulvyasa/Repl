import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateFolderSchemaType } from "@repo/zod/files";

const initialState: TemplateFolderSchemaType = {
  folderName: "",
  items: [],
};

const playgroundTemplateFiles = createSlice({
  name: "playgroundTemplateSlice",
  initialState,
  reducers: {
    addPlaygroundTemplateFiles(
      state,
      action: PayloadAction<TemplateFolderSchemaType>
    ) {
      return action.payload;
    },
  },
});

export const { addPlaygroundTemplateFiles } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;
