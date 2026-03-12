import { useAppDispatch, useAppSelector } from "../hooks";
import { addFileToSelectedFileList, removeFileFromSelectedFileList, updateGloballySelectedFile, updateContentOfGloballySelectedFile, initializeInitialStateFromLocalStorage } from "../features/file-selected";
import { TemplateFile } from "@repo/zod/files";
import { FilesSelected } from "@repo/zod/selected-files";

export const useGlobalSelectedFile = () => {
    const { globallySelectedFile, allgloballySelectedFile } = useAppSelector(state => state.fileSelected);
    const dispatch = useAppDispatch();

    function addNewGlobalSelectedFile(file: TemplateFile, path: string, monacoUri: string, isModified: boolean) {
        const newpath = path.split('/').map((arg) => arg.trim());
        dispatch(addFileToSelectedFileList({ file, path: newpath, monacoUri, isModified }));
    }

    function removeOldGlobalSelectedFile(monacoUri: string) {
        dispatch(removeFileFromSelectedFileList(monacoUri));
    }

    function updateGlobalSelectedFile(monacoUri: string) {
        dispatch(updateGloballySelectedFile(monacoUri));
    }

    function updateContentOfGlobalSelectedFile(newContent: string) {
        dispatch(updateContentOfGloballySelectedFile(newContent));
    }

    function initializeIntialStateOfSelectedFiles(data: FilesSelected) {
        dispatch(initializeInitialStateFromLocalStorage(data))
    }


    return {
        globallySelectedFile,
        allgloballySelectedFile,
        addNewGlobalSelectedFile,
        removeOldGlobalSelectedFile,
        updateGlobalSelectedFile,
        updateContentOfGlobalSelectedFile,
        initializeIntialStateOfSelectedFiles
    };
}