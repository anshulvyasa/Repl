"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles } from "@/services";
import { TemplateFolderSchema } from "@repo/zod/files";
import { selectedPlaygroundSchema } from "@repo/zod/playground";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Playground = () => {
  const { id } = useParams<{ id: string }>();
  const { updatePlaygroundTemplateFiles } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } = useSelectedPlaygroundInfo();

  const [sidebarWidth, setSidebarWidth] = useState<number>(260);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);
      const parsedRes = TemplateFolderSchema.safeParse(res.files.content);
      const parsedSelectedPlayground = selectedPlaygroundSchema.safeParse(res.playground)

      if (parsedSelectedPlayground.success) {
        updateSelectedPlaygroundFn(parsedSelectedPlayground.data)
      }

      if (parsedRes.success) {
        parsedRes.data.folderName = parsedSelectedPlayground.data?.title as string;
        sortTemplateTree(parsedRes.data.items);
        updatePlaygroundTemplateFiles(parsedRes.data);
      }
      else toast.error("Some Error Occured at the client side");
    }

    fetchData();
  }, [id]);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">

        <TemplateFileTree
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
          isResizing={isResizing}
          setIsResizing={setIsResizing}
        />

        <div
          className={cn(
            "flex flex-1 flex-col min-w-0 overflow-hidden",
            !isResizing && "transition-[margin] duration-300 ease-in-out",
            isResizing && "!transition-none !duration-0"
          )}
        >
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => {
                setSidebarWidth(sidebarWidth === 0 ? 260 : 0);
              }}
            />
            <div className="flex flex-1 items-center gap-2">
              <h1 className="text-sm font-medium">{selectedPlayground?.title || "Code Playground"}</h1>
            </div>
          </header>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Playground;