import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { selectedPlaygroundSchemaType } from "@repo/zod/playground";

type PlaygroundState = selectedPlaygroundSchemaType | null;

const initialState = null as PlaygroundState;

const playgroundInfoSlice = createSlice({
    name: "playgroundInfo",
    initialState,
    reducers: {
        updateSelectedPlayground(
            _state,
            action: PayloadAction<PlaygroundState>
        ) {
            return action.payload;
        },
    },
});

export default playgroundInfoSlice.reducer;
export const { updateSelectedPlayground } =
    playgroundInfoSlice.actions;
