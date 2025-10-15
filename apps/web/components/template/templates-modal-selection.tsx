"use client";

import { TemplateOption } from "@/types";
import { useState } from "react";
import { ConfigureTemplate } from "./configure-template";
import { Templates } from "./templates";
import { Dialog } from "../ui/dialog";
import { useDialogSelectorAndDispatcher } from "@/lib/redux/selectoranddispatcher/useDialogSelectorandDispatcher";

export const TemplateModelSelection = ({
  templates,
}: {
  templates: TemplateOption[];
}) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const { dialogState, closeDialog } = useDialogSelectorAndDispatcher();

  return (
    <Dialog
      open={dialogState}
      onOpenChange={() => {
        if (!open) {
          setStep("select");
          closeDialog();
        }
      }}
    >
      {step == "select" ? (
        <Templates templates={templates} setStep={setStep} />
      ) : (
        <ConfigureTemplate setStep={setStep} />
      )}
    </Dialog>
  );
};
