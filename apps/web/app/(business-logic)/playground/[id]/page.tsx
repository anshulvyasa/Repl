"use client";

import { TemplateFileTree } from "@/components/files/files-structure";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles } from "@/services";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Playground = () => {
  const { id } = useParams<{ id: string }>();

  const { updatePlaygroundTemplateFiles } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } =
    useSelectedPlaygroundInfo();

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

 useEffect(() => {
  async function fetchData() {
    const res = await getPlaygroundTemplateFiles(id);

    updateSelectedPlaygroundFn(res.playground);
    sortTemplateTree(res.files.content.items);
    updatePlaygroundTemplateFiles(res.files.content);
  }

  fetchData();

  return () => {
    updatePlaygroundTemplateFiles(null);
  };
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

        <div className={cn("flex flex-1 flex-col min-w-0 overflow-hidden")}>
          <header className="flex h-16 items-center gap-2 border-b px-4">
            <SidebarTrigger
              onClick={() => setSidebarWidth(sidebarWidth === 0 ? 260 : 0)}
            />
            <h1 className="text-sm font-medium">
              {selectedPlayground?.title || "Code Playground"}
            </h1>
          </header>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Playground;
