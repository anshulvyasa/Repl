import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileOperationSchemaType, FileOperationSchemaQueueType, FileOperationSchemaQueue } from '@repo/zod/files-operation-queue'
import { AppThunk } from '../../store';
import { deleteFiles, renameFiles } from '../playground-file-data';
import { log } from 'console';

const defaultState: FileOperationSchemaQueueType = {
    items: [],
    head: -1
};

const calcInitialState = () => {
    try {
        const serializeObject = localStorage.getItem('fileops');

        if (serializeObject === null) return defaultState;
        console.log("Serial Objecyt is ", serializeObject)

        const parsedSerializeObject = FileOperationSchemaQueue.safeParse(JSON.parse(serializeObject))
        if (parsedSerializeObject.error) return defaultState;

        console.log(parsedSerializeObject.data)

        return parsedSerializeObject.data;
    }
    catch (error) {
        return defaultState;
    }
}

const initialState: FileOperationSchemaQueueType = calcInitialState();


const fileOperationQueueSlice = createSlice({
    name: "fileOperationQueue",
    initialState,
    reducers: {
        addOperationToOpsQueue(state, action: PayloadAction<FileOperationSchemaType>) {
            state.items.push(action.payload);
            state.head++;
        },
        removeOperationFromOpsQueue(state) {
            if (state.head > -1) {
                state.items.pop();
                state.head--;
            }
        },
        clearOperationQueue(state) {
            state.items = [];
            state.head = 0;
        }
    }
})

export const localFileUpdateThunk = (): AppThunk => (dispatch, getState) => {
    const fileOpsQueue = getState().fileOperations;

    if (fileOpsQueue.head == -1) return;

    const currentSelectedPlayground = getState().selectedPlaygroundInfo;
    if (!currentSelectedPlayground?.id) return;

    for (const item of fileOpsQueue.items) {
        // handling renaming of current playground
        console.log("items os file Ops is : ", item)
        if (currentSelectedPlayground.id === item.playgroundId && "newName" in item) {
            const path = item.path.split('/').filter(Boolean);
            const newName = item.newName;

            if (path[path.length - 1]?.trim() === newName.trim()) continue;

            dispatch(renameFiles({ path, newName }))
        }

        // handling delete Files
        if (currentSelectedPlayground.id === item.playgroundId && !("newName" in item) && !("data" in item)) {
            const path = item.path.split("/").filter(Boolean);
            dispatch(deleteFiles({ path }));
        }

    }
}



// Todo : backend logic
export const fileQueueThunk = (): AppThunk => (dispatch, getState) => {
}

export default fileOperationQueueSlice.reducer;
export const { addOperationToOpsQueue, removeOperationFromOpsQueue, clearOperationQueue } = fileOperationQueueSlice.actions;