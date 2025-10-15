import { TemplateOption } from "@/types";
import {
  updateSelectedTemplate,
  updateSelectedTemplateProjectName,
} from "../features/template";
import { useAppDispatch, useAppSelector } from "../hooks";

export const useSelectedTemplate = () => {
  const getSelectedTemplateData = useAppSelector(
    (state) => state.selectedTemplate
  );
  const dispatch = useAppDispatch();

  const updateSelectedTemplateName = (name: string|null) => {
    dispatch(updateSelectedTemplateProjectName(name));
  };

  const updateSelectedProjectTemplate = (template: TemplateOption|null) => {
    dispatch(updateSelectedTemplate(template));
  };

  return {
    getSelectedTemplateData,
    updateSelectedProjectTemplate,
    updateSelectedTemplateName,
  };
};
