import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface PreviewUrlType {
    previewUrl: string | null
}


const initialState: PreviewUrlType = {
    previewUrl: null
}

const previewUrlSlice = createSlice({
    name: "previewUrlSlice",
    initialState,
    reducers: {
        setPreviewUrlReducer(state, action: PayloadAction<string>) {
            state.previewUrl = action.payload;
        },
        resetPreviewUrlReducer(state) {
            return {
                previewUrl: null
            }
        }
    }
})


export const { setPreviewUrlReducer, resetPreviewUrlReducer } = previewUrlSlice.actions;
export default previewUrlSlice.reducer;
