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
import { Loader, Zap } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlaygroundSchemaType } from "@repo/zod/playground";
import { createPlayGroundService } from "@/services";
import { toast } from "sonner";
import { useDialogSelectorAndDispatcher } from "@/lib/redux/selectoranddispatcher/useDialogSelectorandDispatcher";
import { useRouter } from "next/navigation";

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
  const { closeDialog } = useDialogSelectorAndDispatcher();
  const router = useRouter();
  const queryClient = useQueryClient();

  // defining The Query to Create Playground
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: createPlaygroundSchemaType) =>
      createPlayGroundService(data),
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["playgrounds"] });
      setTimeout(
        () => router.push(`/playground/${data.data.playgroundId}`),
        4000
      );
    },
  });

  const handleCreateProject = () => {
    if (!getSelectedTemplateData.template) {
      alert("Select Template First");
      return;
    }

    const templateMap: Record<
      string,
      "REACT" | "NEXT" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR"
    > = {
      react: "REACT",
      next: "NEXT",
      express: "EXPRESS",
      vue: "VUE",
      hono: "HONO",
      angular: "ANGULAR",
    };

    const reqData: createPlaygroundSchemaType = {
      title:
        getSelectedTemplateData.name ||
        `playground-${window.crypto.randomUUID()}`,
      description:
        getSelectedTemplateData.template?.description ||
        `let's build something crazy`,
      template: templateMap[getSelectedTemplateData.template?.id] || "REACT",
    };

    mutate(reqData);

    if (isError) {
      toast.error("Error Creating The PlayGround");
      return;
    }

    toast.success(
      "PlayGround Created Successfully Redirecting You to PlayGround in Few Second"
    );

    updateSelectedTemplateName(null);
    updateSelectedProjectTemplate(null);
    setStep("select");
    closeDialog();
  };

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
        {isPending ? (
          <Button className="bg-[#E93F3F]">
            <Loader className="animate-spin transition-all ease-in" />
            <span>Creating...</span>
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              className="bg-[#E93F3F] hover:bg-[#d03636]"
              onClick={handleCreateProject}
            >
              Create Project
            </Button>
          </>
        )}
      </div>
    </DialogContent>
  );
};
