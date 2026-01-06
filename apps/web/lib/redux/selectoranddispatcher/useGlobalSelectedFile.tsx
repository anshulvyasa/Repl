import { TemplateFile } from "@repo/zod/files";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addGlobalSelectedFile, removeFromAllGlobalFileSelected, removeGloballySelectedFile } from "../features/file-selected";

export const useGlobalSelectedFile = () => {
    const { globallySelectedFile, globallySelectedFilePath, AllGloballySelectedFile } = useAppSelector(state => state.fileSelected);
    const dispatch = useAppDispatch();

    function addNewGlobalSelectedFile(file: TemplateFile, path: string) {
        const newpath = path.split('/').map((arg) => arg.trim());
        dispatch(addGlobalSelectedFile({ file, path: newpath }));
    }

    function removeOldGlobalSelectedFile() {
        dispatch(removeGloballySelectedFile());
    }

    function removeGloballyFileFromParticulerIndex(index: number) {
        dispatch(removeFromAllGlobalFileSelected(index));
    }


    return {
        globallySelectedFile,
        globallySelectedFilePath,
        AllGloballySelectedFile,
        addNewGlobalSelectedFile,
        removeOldGlobalSelectedFile,
        removeGloballyFileFromParticulerIndex
    };
}