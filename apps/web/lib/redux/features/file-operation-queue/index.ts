import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileOperationSchemaType, FileOperationSchemaQueueType, FileOperationSchemaQueue } from '@repo/zod/files-operation-queue'

const defaultState: FileOperationSchemaQueueType = {
    items: [],
    head: -1
};

const calcInitialState = () => {
    try {
        const serializeObject = localStorage.getItem('fileops');
        if (serializeObject === null) return defaultState;

        const parsedSerializeObject = FileOperationSchemaQueue.safeParse(JSON.parse(serializeObject))
        if (parsedSerializeObject.error) return defaultState;

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

export default fileOperationQueueSlice.reducer;
export const { addOperationToOpsQueue, removeOperationFromOpsQueue, clearOperationQueue } = fileOperationQueueSlice.actions;