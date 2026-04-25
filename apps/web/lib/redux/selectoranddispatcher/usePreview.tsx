import { resetPreviewUrlReducer, setPreviewUrlReducer } from "../features/peview_url";
import { useAppDispatch, useAppSelector } from "../hooks"

export const usePreview = () => {
    const previewUrl = useAppSelector(state => state.previewUrl)
    const dispatch = useAppDispatch();

    const setPreviewUrl = (url: string) => {
        dispatch(setPreviewUrlReducer(url))
    }

    const resetPreviewUrl = () => {
        dispatch(resetPreviewUrlReducer())
    }

    return { previewUrl, setPreviewUrl, resetPreviewUrl };
}

