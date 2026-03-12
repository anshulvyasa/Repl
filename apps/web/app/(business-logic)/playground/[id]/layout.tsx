"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { readFileOperationFromLocalStorage } from "@/lib/redux/middleware";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const [areTemplateFileUpdated, SetAreTemplateFileUpdated] = useState<boolean>(false);

  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } =
    useSelectedPlaygroundInfo();


  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedPlayground || !templatePlaygroundSelector ) return;

    const readFileOpsLocalStorage = readFileOperationFromLocalStorage(selectedPlayground.id);
    console.log("File Ops from The ", readFileOpsLocalStorage)

    setLoading(false);
  }, [selectedPlayground, templatePlaygroundSelector]);

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);

      updateSelectedPlaygroundFn(res.playground);
      sortTemplateTree(res.files.content.items);
      updatePlaygroundTemplateFiles(res.files.content);
      SetAreTemplateFileUpdated(true);
    }

    fetchData();

    return () => {
      updatePlaygroundTemplateFiles(null);
    };
  }, [id]);

  if(!areTemplateFileUpdated) return <div>Getting files From Server...</div> 
  if (loading) return <div>
    Loading...
  </div>

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default PlaygroundLayout;
