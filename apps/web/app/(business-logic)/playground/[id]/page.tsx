"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { getPlaygroundTemplateFiles } from "@/services";
import { TemplateFolderSchema } from "@repo/zod/files";
import { selectedPlaygroundSchema } from "@repo/zod/playground";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } =
    useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } = useSelectedPlaygroundInfo();

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);
      const parsedRes = TemplateFolderSchema.safeParse(res.files.content);
      const parsedSelectedPlayground = selectedPlaygroundSchema.safeParse(res.playground)

      if (parsedSelectedPlayground.success) {
        updateSelectedPlaygroundFn(parsedSelectedPlayground.data)
      }

      if (parsedRes.success) updatePlaygroundTemplateFiles(parsedRes.data);
      else toast.error("Some Error Occured at the client side");
    }

    fetchData();
  }, [id]);


  return (
    <TooltipProvider>
      <TemplateFileTree />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center gap-2">
            <h1 className="text-sm font-medium">{selectedPlayground?.title || "Code Playground"}</h1>
          </div>
        </header>
      </SidebarInset>
    </TooltipProvider>
  );
};

export default Playground;
