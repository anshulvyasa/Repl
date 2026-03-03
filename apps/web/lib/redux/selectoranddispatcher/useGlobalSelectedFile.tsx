import { useAppDispatch, useAppSelector } from "../hooks";
import { addFileToSelectedFileList, removeFileFromSelectedFileList, updateGloballySelectedFile } from "../features/file-selected";
import { TemplateFile } from "@repo/zod/files";

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


    return {
        globallySelectedFile,
        allgloballySelectedFile,
        addNewGlobalSelectedFile,
        removeOldGlobalSelectedFile,
        updateGlobalSelectedFile
    };
}