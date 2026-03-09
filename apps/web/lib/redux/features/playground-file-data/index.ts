import { sortTemplateTree } from "@/lib/utils";
import { TemplateFile } from "@prisma/client";
import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { deleteFilesOrFolder, renameFilesOrFolder, addFileOrFolder } from "@repo/utilities/files-operation";
import { TemplateFolder, TemplateFolderSchemaType, TemplateItem } from "@repo/zod/files";

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
    },

    updateFileContent(state, action: PayloadAction<{ path: string[], newContent: string }>) {
      const { path, newContent } = action.payload;
      if (!state || !path || path.length === 0) return;

      const foldersToTraverse = path.slice(1, -1);
      const targetFileName = path[path.length - 1];

      let currentFolder = state;

      for (const folderName of foldersToTraverse) {
        const nextFolder = currentFolder.items.find(
          (item) => "folderName" in item && item.folderName.trim() === folderName.trim()
        ) as TemplateFolder | undefined;

        if (!nextFolder) return;

        currentFolder = nextFolder;
      }

      const targetFile = currentFolder.items.find(
        (item) =>
          "fileName" in item &&
          generateFileName(item.fileName, item.fileExtension) === targetFileName
      ) as TemplateFile | undefined;

      if (targetFile) {
        targetFile.content = newContent; // Immer handles this mutation safely!
      }
    }
  },
});

export const { addPlaygroundTemplateFiles, renameFiles, deleteFiles, addFiles, sortSubFiles, updateFileContent } = playgroundTemplateFiles.actions;
export default playgroundTemplateFiles.reducer;


// helper
const generateFileName = (fileName: string, fileExtension: string) => {
  if (fileExtension.trim() === "") return fileName;

  return `${fileName}.${fileExtension}`
}

