import { isAction, Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { FilesSelected, ModifiedFileSelected } from "../features/file-selected";
import { TemplateFilesTypes } from "../features/playground-file-data";
import { useTemplatePlayground } from "../selectoranddispatcher/useTemplatePlayground";
import { FilesSelectedSchema } from "@repo/zod/selected-files";

const TTL = 7 * 24 * 60 * 60 * 1000;
const STORAGE_SELECTED_FILE_PREFIX = "playground-selected-files";

type SelectedFileDataLocalStorageType = {
    state: FilesSelected,
    expiredAt: number
}

// Helper to ensure the key is always perfectly formatted everywhere
const getStorageKey = (playgroundId: string) => `${STORAGE_SELECTED_FILE_PREFIX}:${playgroundId}`;

export const selectedFileMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
    const result = next(action);

    // mechanism for selected files
    if (isAction(action) && action.type.startsWith('selectedfile/')) {
        const playgroundId = store.getState().selectedPlaygroundInfo?.id;
        const selectedFilesData = store.getState().fileSelected;

        if (playgroundId) {
            const key = getStorageKey(playgroundId);
            localStorage.setItem(key, JSON.stringify(selectedFilesData));
        }
    }

    return result;
}

export const readSelectedFilesFromLocalStorage = (playgroundId: string): FilesSelected | null => {
    const key = getStorageKey(playgroundId);
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    try {
        const data = JSON.parse(stored);
        const result = FilesSelectedSchema.safeParse(data);

        if (!result.success) {
            // result.error contains the specific field that failed
            console.error('Validation failed:', result.error.format());
            throw new Error("Wrong Data Stored in local cache");
        }

        return result.data;
    }
    catch (error) {
        console.error('Failed to restore selected file from storage:', error);
        localStorage.removeItem(key);
        return null;
    }
}

export const clearStoredSelectedFiles = (playgroundId: string) => {
    const key = getStorageKey(playgroundId);
    localStorage.removeItem(key);
};

export const updatePlaygroundFileFromTheCacheToReduxState = (allgloballySelectedFile: Record<string, ModifiedFileSelected>, files: TemplateFilesTypes) => {
    const keys = Object.keys(allgloballySelectedFile);
    const { updateFile } = useTemplatePlayground();

    for (const key of keys) {
        const val = allgloballySelectedFile[key];

        if (val?.path) updateFile(val?.path, val?.file.content);
    }
}