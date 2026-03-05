import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateFile } from "@repo/zod/files";

export interface ModifiedFileSelected {
    file: TemplateFile;
    isModified: boolean;  // to save it on backend
    monacoUri: string     // to load the modal in editor
    path: string[]        // to update the redux state 
}

export interface FilesSelected {
    globallySelectedFile: string | null;
    allgloballySelectedFile: Record<string, ModifiedFileSelected>;
}

const initialState: FilesSelected = {
    globallySelectedFile: null,
    allgloballySelectedFile: {}
}

const selectedFileSlice = createSlice({
    name: "selectedfile",
    initialState,
    reducers: {
        addFileToSelectedFileList(state, action: PayloadAction<{ file: TemplateFile, isModified: boolean, monacoUri: string, path: string[] }>) {
            const item = state.allgloballySelectedFile[action.payload.monacoUri];

            if (item) {
                state.globallySelectedFile = action.payload.monacoUri;
                return;
            }

            const new_file: ModifiedFileSelected = {
                file: action.payload.file,
                isModified: action.payload.isModified,
                monacoUri: action.payload.monacoUri,
                path: action.payload.path
            }

            state.allgloballySelectedFile[action.payload.monacoUri] = new_file;
            state.globallySelectedFile = action.payload.monacoUri;
        },
        updateGloballySelectedFile(state, action: PayloadAction<string>) {
            state.globallySelectedFile = action.payload;
        },
        removeFileFromSelectedFileList(state, action: PayloadAction<string>) {
            if (!state.allgloballySelectedFile[action.payload]) {
                return;
            }

            delete state.allgloballySelectedFile[action.payload];

            if (state.globallySelectedFile === action.payload) {
                const key = Object.keys(state.allgloballySelectedFile)[0] || null;
                state.globallySelectedFile = key;
            }
        }
    }
})


export default selectedFileSlice.reducer;
export const { addFileToSelectedFileList, updateGloballySelectedFile, removeFileFromSelectedFileList } = selectedFileSlice.actions;