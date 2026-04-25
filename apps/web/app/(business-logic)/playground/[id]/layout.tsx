"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { readFileOperationFromLocalStorage, updateTemplateFilesFromCache } from "@/lib/redux/middleware";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { buildWebContainerFileTree, sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles, updateFilesOperationService } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { LoadingSkeleton } from "@/components/loading/playground-skelton";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useFileOperations } from "@/lib/redux/selectoranddispatcher/useFileOperationQueue";
import { getWebContainerInstance } from "@/lib/webcontainer";
import { toast } from "sonner";
import { FileSystemTree } from "@webcontainer/api";



const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  // defining The Dispatcher
  const dispatch = useAppDispatch();
  const { initializeFileOpsQueue, fileOpsQueue, clearOpsQueue } = useFileOperations();

  const { id } = useParams<{ id: string }>();
  const [areTemplateFileUpdated, SetAreTemplateFileUpdated] = useState<boolean>(false);
  const webContainerStatusRef = useRef<boolean>(false);

  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn } =
    useSelectedPlaygroundInfo();

  const [loading, setLoading] = useState<boolean>(true);

  // Fetching and Updating Files Locally
  useEffect(() => {
    async function fetchData() {
      // Getting Files From Backend
      const res = await getPlaygroundTemplateFiles(id);

      updateSelectedPlaygroundFn(res.playground);
      sortTemplateTree(res.files.content.items);
      updatePlaygroundTemplateFiles(res.files.content);

      // Update The Infos
      const readFileOpsLocalStorage = readFileOperationFromLocalStorage(id);
      if (readFileOpsLocalStorage) {
        initializeFileOpsQueue(readFileOpsLocalStorage);
        dispatch(updateTemplateFilesFromCache(readFileOpsLocalStorage))
      }

      setTimeout(()=>SetAreTemplateFileUpdated(true),2000)
    }

    fetchData();

    return () => {
      updatePlaygroundTemplateFiles(null);
    };
  }, [id]);

  // webConatinerRelatedInstance
  useEffect(() => {
    if (!areTemplateFileUpdated || !templatePlaygroundSelector ) return;
    // webContainerStatusRef.current = true;

    // Setting Up Web Container Instance
    const run = async () => {
      const webContainer = await getWebContainerInstance();
      if (!webContainer) {
        toast.error("Error While Creating Web Conatiner Instance");
        return;
      }

      const webContainerFileTree: FileSystemTree = {};
      buildWebContainerFileTree(templatePlaygroundSelector, webContainerFileTree);

      await webContainer.mount(webContainerFileTree);
      toast.success("WebContainer booted successfully. Starting setup...");

      setLoading(false);
    }

    run();
  }, [areTemplateFileUpdated])

  // For Sending The File Ops Queue To Backend
  useEffect(() => {
    let isSending = true;

    const run = async () => {
      while (isSending) {
        await new Promise((resolve) => setTimeout(resolve, 30000));
        if (fileOpsQueue.items.length === 0) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          continue;
        }

        const fileOpsQueueCopy = { ...fileOpsQueue };
        clearOpsQueue();

        try {
          const res = await updateFilesOperationService(id, fileOpsQueueCopy);
          console.log("Response is ", res);

          if (!res.success) throw new Error();
        } catch (error) {
          console.error("backend may be Down");

          if (fileOpsQueue.items.length === 0) {
            initializeFileOpsQueue(fileOpsQueueCopy);
          } else {
            const newFileOpsQueue = {
              ...fileOpsQueueCopy,
              items: [...fileOpsQueueCopy.items, ...fileOpsQueue.items],
            };
            initializeFileOpsQueue(newFileOpsQueue);
          }
        }
      }
    };

    run();

    return () => {
      isSending = false;
    };
  }, [fileOpsQueue]);

  if (!areTemplateFileUpdated || loading) return <LoadingSkeleton />

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default PlaygroundLayout;
