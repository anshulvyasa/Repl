"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { readFileOperationFromLocalStorage, updateTemplateFilesFromCache } from "@/lib/redux/middleware";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles, updateFilesOperationService } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { LoadingSkeleton } from "@/components/loading/playground-skelton";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useFileOperations } from "@/lib/redux/selectoranddispatcher/useFileOperationQueue";



const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  // defining The Dispatcher
  const dispatch = useAppDispatch();
  const { initializeFileOpsQueue, fileOpsQueue } = useFileOperations();

  const { id } = useParams<{ id: string }>();
  const [areTemplateFileUpdated, SetAreTemplateFileUpdated] = useState<boolean>(false);

  const { updatePlaygroundTemplateFiles } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn } =
    useSelectedPlaygroundInfo();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      const res = await getPlaygroundTemplateFiles(id);

      updateSelectedPlaygroundFn(res.playground);
      sortTemplateTree(res.files.content.items);
      updatePlaygroundTemplateFiles(res.files.content);
      SetAreTemplateFileUpdated(true);

      // Update The Infos
      const readFileOpsLocalStorage = readFileOperationFromLocalStorage(id);
      console.log("File Ops from The ", readFileOpsLocalStorage);
      if (readFileOpsLocalStorage) {
        initializeFileOpsQueue(readFileOpsLocalStorage);
        dispatch(updateTemplateFilesFromCache(readFileOpsLocalStorage))
      }

      setLoading(false);
    }

    fetchData();

    return () => {
      updatePlaygroundTemplateFiles(null);
    };
  }, [id]);

  // For Sending The File Ops Queue To Backend
  useEffect(() => {
    const interval = setInterval(async () => {
      if (fileOpsQueue.head == -1) return;

      console.log("Queue is ", fileOpsQueue.items, "  head is ",fileOpsQueue.head);
      const res = await updateFilesOperationService(id, fileOpsQueue);
      console.log("Response from the fileOps Interval is ", res);
    }, 5000);

    return () => {
      clearInterval(interval)
    }
  }, [fileOpsQueue])

  if (!areTemplateFileUpdated || loading) return <LoadingSkeleton />

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default PlaygroundLayout;
