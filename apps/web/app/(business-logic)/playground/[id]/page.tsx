"use client";

import { TemplateFileTree } from "@/components/files/file-tree";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { getPlaygroundTemplateFiles } from "@/services";
import { TemplateFolderSchema } from "@repo/zod/files";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } =
    useTemplatePlayground();

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);
      const parsedRes = TemplateFolderSchema.safeParse(res.files.content);

      if (parsedRes.success) updatePlaygroundTemplateFiles(parsedRes.data);
      else toast.error("Some Error Occured at the client side");
    }

    fetchData();
  }, [id]);

  return (
    <TooltipProvider>
      <TemplateFileTree />
    </TooltipProvider>
  );
};

export default Playground;
