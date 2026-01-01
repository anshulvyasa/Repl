import { TemplateFolderSchemaType, TemplateItem } from "@repo/zod/files";
import { addFiles, addPlaygroundTemplateFiles, deleteFiles, renameFiles, sortSubFiles, } from "../features/playground-file-data";
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
  dispatch(
    renameFiles({
      path, 
      newName,
    })
  );
};

const deleteTemplateFiles = (path: string[]) => {
  dispatch(
    deleteFiles({
      path, 
    })
  );
};

const addTemplateFiles = (data: TemplateItem, path: string[]) => {
  dispatch(
    addFiles({
      data,
      path,
    })
  );
};






  return {
    updatePlaygroundTemplateFiles,
    templatePlaygroundSelector,
    renameTemplateFilesOrFolder,
    deleteTemplateFiles,
    addTemplateFiles,
    
  };
};
