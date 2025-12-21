import { sortTemplateTree } from "@/lib/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteFilesOrFolder, renameFilesOrFolder, addFileOrFolder } from "@repo/utilities/files-operation";
import { TemplateFolderSchemaType, TemplateItem } from "@repo/zod/files";

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
    },
    addFiles(state, action: PayloadAction<{ data: TemplateItem, path: string[] }>) {
      const { data, path } = action.payload;
      if (!state) return state;
      addFileOrFolder(state, data, path, 0);
    },
    sortSubFiles(state, action: PayloadAction<{ data: TemplateItem[] }>) {
      if (!state) return state;
      const { data } = action.payload;

      if ("folderName" in state) {
        sortTemplateTree(state.items);
      }
    }
  },
});

export const { addPlaygroundTemplateFiles, renameFiles, deleteFiles, addFiles, sortSubFiles } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;
