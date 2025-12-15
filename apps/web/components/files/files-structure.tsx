"use client";

import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction } from "../ui/sidebar";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import React, { useMemo, useState } from "react";
import FileTree from "./file-tree";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ArrowLeftRight, FilePlus, FolderPlus, Plus } from "lucide-react";

export const TemplateFileTree = ({ sidebarWidth, setSidebarWidth }: { sidebarWidth: number, setSidebarWidth: React.Dispatch<React.SetStateAction<number>> }) => {
  const { selectedPlayground } = useSelectedPlaygroundInfo();
  const { templatePlaygroundSelector } = useTemplatePlayground();

  const compresedTitle = useMemo(() => {
    return selectedPlayground?.title.substring(0, 30);
  }, [selectedPlayground?.title])

  const handleSidebarMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const newWidth = startWidth + delta;

      // apply min / max
      if (newWidth < 200) {
        setSidebarWidth(200);
      } else if (newWidth > 420) {
        setSidebarWidth(420);
      } else {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };



  return <Sidebar style={{
    ["--sidebar-width" as any]: `${sidebarWidth}px`,
  }} className="transition-[width] duration-100">
    <SidebarContent className="scrollbar-hide">
      <SidebarGroup>
        <div className="flex items-center">
          <SidebarGroupLabel className="text-sm">{compresedTitle}</SidebarGroupLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarGroupAction>
                <Plus className="h-4 w-4" />
              </SidebarGroupAction>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FilePlus className="h-4 w-4 mr-2" />
                <span>Add File</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderPlus className="h-4 w-4 mr-2" />
                <span>Add Folder</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarGroup>

      <SidebarGroupContent>
        <FileTree path="" level={0} data={templatePlaygroundSelector} />
      </SidebarGroupContent>
    </SidebarContent>

    <div className="absolute right-0 top-0 h-full w-3 cursor-col-resize group/resize" onMouseDown={handleSidebarMouseDown} />

  </Sidebar>
};
