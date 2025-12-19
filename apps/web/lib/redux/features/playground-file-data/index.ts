import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateFolderSchemaType } from "@repo/zod/files";

export type TemplateFilesTypes = TemplateFolderSchemaType | null;

const initialState: TemplateFilesTypes = {
  folderName: "",
  items: [],
};

const playgroundTemplateFiles = createSlice({
  name: "playgroundTemplateSlice",
  initialState: initialState as TemplateFilesTypes,
  reducers: {
    addPlaygroundTemplateFiles(
      state,
      action: PayloadAction<TemplateFilesTypes>
    ) {
      return action.payload;
    },
  },
});

export const { addPlaygroundTemplateFiles } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;
