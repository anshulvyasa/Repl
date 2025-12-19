import { TemplateFolder, TemplateFolderSchemaType } from "@repo/zod/files";
import { addPlaygroundTemplateFiles } from "../features/playground-file-data";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useTemplatePlayground = () => {
  const dispatch = useAppDispatch();
  const templatePlaygroundSelector = useAppSelector(
    (state) => state.playgroundTemplateFiles
  );

  const updatePlaygroundTemplateFiles = (files: TemplateFolderSchemaType|null) => {
    dispatch(addPlaygroundTemplateFiles(files));
  };

  return {
    updatePlaygroundTemplateFiles,
    templatePlaygroundSelector,
  };
};
