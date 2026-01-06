import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateFile } from "@repo/zod/files";

export interface FileSelectedType {
    globallySelectedFile: TemplateFile | null
    globallySelectedFilePath: string[];
    AllGloballySelectedFile: { file: TemplateFile, path: string[] }[]
}

const initialState: FileSelectedType = {
    globallySelectedFile: null,
    globallySelectedFilePath: [],
    AllGloballySelectedFile: []
}

const globallySelectedFilesSlice = createSlice({
    name: 'file-selected',
    initialState,
    reducers: {
        addGlobalSelectedFile(state, action: PayloadAction<{ file: TemplateFile, path: string[] }>) {
            const { file, path } = action.payload;
            state.globallySelectedFile = file;
            state.globallySelectedFilePath = path
            state.AllGloballySelectedFile.push({
                file, path
            })
        },
        removeGloballySelectedFile(state) {
            state.globallySelectedFile = null;
            state.globallySelectedFilePath = [];
        },
        removeFromAllGlobalFileSelected(state, action: PayloadAction<number>) {
            const index = action.payload;
            state.AllGloballySelectedFile.splice(index, 1)
        }
    }
})

export const { addGlobalSelectedFile, removeFromAllGlobalFileSelected, removeGloballySelectedFile } = globallySelectedFilesSlice.actions;
export default globallySelectedFilesSlice.reducer;
