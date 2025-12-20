import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteFilesOrFolder, renameFilesOrFolder } from "@repo/utilities/files-operation";
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
    renameFiles(state, action: PayloadAction<{ path: string[], newName: string }>) {
      const { path, newName } = action.payload;
      if (!state) return state;
      renameFilesOrFolder(state, path, 0, newName);
    },
    deleteFiles(state, action: PayloadAction<{ path: string[] }>) {
      const { path } = action.payload;
      if (!state) return state;
      deleteFilesOrFolder(state, path, 0);
    }
  },
});

export const { addPlaygroundTemplateFiles, renameFiles, deleteFiles } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;
