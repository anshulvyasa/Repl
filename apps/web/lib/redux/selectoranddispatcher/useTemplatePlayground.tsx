import { TemplateFolderSchemaType } from "@repo/zod/files";
import { addPlaygroundTemplateFiles, deleteFiles, renameFiles, } from "../features/playground-file-data";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useTemplatePlayground = () => {
  const dispatch = useAppDispatch();
  const templatePlaygroundSelector = useAppSelector(
    (state) => state.playgroundTemplateFiles
  );

  const updatePlaygroundTemplateFiles = (files: TemplateFolderSchemaType | null) => {
    dispatch(addPlaygroundTemplateFiles(files));
  };
  const renameTemplateFilesOrFolder = (path: string[], newName: string) => {
    dispatch(renameFiles({ path, newName }));
  }
  const deleteTemplateFiles = (path: string[]) => {
    dispatch(deleteFiles({ path }));
  }

  return {
    updatePlaygroundTemplateFiles,
    templatePlaygroundSelector,
    renameTemplateFilesOrFolder,
    deleteTemplateFiles
  };
};
