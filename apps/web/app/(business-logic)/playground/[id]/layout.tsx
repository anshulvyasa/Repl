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
  const { initializeFileOpsQueue, fileOpsQueue, clearOpsQueue } = useFileOperations();

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
        // dispatch(updateTemplateFilesFromCache(readFileOpsLocalStorage))
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
