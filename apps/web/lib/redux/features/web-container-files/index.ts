import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FileSystemTree } from '@webcontainer/api'

export interface WebContainerFileSystem {
    webConatinerFiles: FileSystemTree | null
}

const initialState: WebContainerFileSystem = {
    webConatinerFiles: null
}

const webContainerFileSystemSlice = createSlice({
    name: "webcontainer-file-system",
    initialState,
    reducers: {
        addWebContainerFiles(state, action: PayloadAction<FileSystemTree>) {
            state.webConatinerFiles = action.payload;
        },
        removeWebConatinerFiles(state) {
            state.webConatinerFiles = null;
        }

    }
})

export default webContainerFileSystemSlice.reducer;
export const { addWebContainerFiles, removeWebConatinerFiles } = webContainerFileSystemSlice.actions;