"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { readFileOperationFromLocalStorage } from "@/lib/redux/middleware";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { sortTemplateTree } from "@/lib/utils";
import { getPlaygroundTemplateFiles } from "@/services";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";

const LoadingSkeleton = () => (
  <SidebarProvider>
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Skeleton Sidebar */}
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <Skeleton className="h-6 w-3/4" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <Skeleton className="h-4 w-20" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SidebarMenuSkeleton key={i} showIcon />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {/* Main Content Skeleton */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Header Skeleton */}
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-5 w-48" />
        </header>

        {/* Tabs Skeleton */}
        <div className="flex gap-1 p-2 border-b bg-muted/30">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-t-md" />
          ))}
        </div>

        {/* Editor Skeleton */}
        <div className="flex-1 p-4">
          <Card className="h-full">
            <div className="p-4 space-y-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" style={{ width: `${Math.random() * 40 + 60}%` }} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </SidebarProvider>
);

const PlaygroundLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const [areTemplateFileUpdated, SetAreTemplateFileUpdated] = useState<boolean>(false);

  const { updatePlaygroundTemplateFiles, templatePlaygroundSelector } = useTemplatePlayground();
  const { updateSelectedPlaygroundFn, selectedPlayground } =
    useSelectedPlaygroundInfo();


  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!selectedPlayground || !templatePlaygroundSelector) return;

    const readFileOpsLocalStorage = readFileOperationFromLocalStorage(selectedPlayground.id);
    console.log("File Ops from The ", readFileOpsLocalStorage);

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


  if (!areTemplateFileUpdated || loading) return <LoadingSkeleton />

  return <SidebarProvider>{children}</SidebarProvider>;
};

export default PlaygroundLayout;
