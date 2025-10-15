import React from "react";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useSelectedTemplate } from "@/lib/redux/selectoranddispatcher/useSelectedTemplate";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Zap } from "lucide-react";

export const ConfigureTemplate = ({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<"select" | "configure">>;
}) => {
  const {
    getSelectedTemplateData,
    updateSelectedTemplateName,
    updateSelectedProjectTemplate,
  } = useSelectedTemplate();

  const handleCreateProject = () => {};

  const handleBack = () => {
    updateSelectedTemplateName(null);
    updateSelectedProjectTemplate(null);
    setStep("select");
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-[#e93f3f]">
          Configure Your Project
        </DialogTitle>
        <DialogDescription>
          {getSelectedTemplateData.template?.name || "Your"} project
          cFonfiguration
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name">Project Name</Label>
          <Input
            id="project-name"
            placeholder="my-awesome-project"
            value={getSelectedTemplateData.name || ""}
            onChange={(e) => updateSelectedTemplateName(e.target.value)}
          />
        </div>

        <div className="p-4 shadow-[0_0_0_1px_#E93F3F,0_8px_20px_rgba(233,63,63,0.15)] rounded-lg border">
          <h3 className="font-medium mb-2">Selected Template Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {getSelectedTemplateData.template &&
              getSelectedTemplateData.template.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Zap size={14} className="text-[#E93F3F]" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          className="bg-[#E93F3F] hover:bg-[#d03636]"
          onClick={handleCreateProject}
        >
          Create Project
        </Button>
      </div>
    </DialogContent>
  );
};
