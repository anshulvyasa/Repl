import { sortTemplateTree } from "@/lib/utils";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
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
      if (!action.payload) return state;
      sortTemplateTree(action.payload.items);
      return action.payload;
    },
    renameFiles(state, action) {
      console.log("REDUX RENAME PATH =>", action.payload.path);
      const { path, newName } = action.payload;

      if (!state) return state;

      const relativePath = path.slice(1);
      renameFilesOrFolder(state, relativePath, 0, newName);
      sortTemplateTree(state.items);
    },

    deleteFiles(state, action) {
      console.log("REDUX DELETE PATH =>", action.payload.path);
      const { path } = action.payload;

      if (!state) return state;

      const relativePath = path.slice(1);
      deleteFilesOrFolder(state, relativePath, 0);
      sortTemplateTree(state.items);
    },

    addFiles(state, action) {
      const { data, path } = action.payload;
      if (!state) return state;


      const relativePath = path.slice(1, -1);

      addFileOrFolder(state, data, relativePath, 0);
      sortTemplateTree(state.items);
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
