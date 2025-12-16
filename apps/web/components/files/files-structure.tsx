"use client";

import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, useSidebar } from "../ui/sidebar";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import React, { useMemo, useCallback, useContext } from "react";
import FileTree from "./file-tree";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FilePlus, FolderPlus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateFileTreeProps {
  sidebarWidth: number;
  setSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  isResizing: boolean;
  setIsResizing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TemplateFileTree = ({
  sidebarWidth,
  setSidebarWidth,
  isResizing,
  setIsResizing
}: TemplateFileTreeProps) => {
  const { selectedPlayground } = useSelectedPlaygroundInfo();
  const { templatePlaygroundSelector } = useTemplatePlayground();
  const sidebarContext = useSidebar();


  const compresedTitle = useMemo(() => {
    return selectedPlayground?.title.substring(0, 30);
  }, [selectedPlayground?.title])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const rawWidth = startWidth + delta;


      const SNAP_THRESHOLD = 50;

      if (rawWidth < SNAP_THRESHOLD) {
        setSidebarWidth(0);
        if (sidebarContext.open) sidebarContext.setOpen(false);
      } else {
        const newWidth = Math.min(420, rawWidth);
        setSidebarWidth(newWidth);

        if (!sidebarContext.open) sidebarContext.setOpen(true);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [sidebarWidth, setIsResizing, setSidebarWidth]);

  return (
    <div
      className="relative h-full border-r bg-sidebar flex-shrink-0"
      style={{ width: `${sidebarWidth}px` }}
    >
      <Sidebar
        collapsible="none"
        className={cn(
          "h-full w-full overflow-hidden",
          isResizing ? "!transition-none !duration-0" : "transition-[width] duration-300 ease-in-out"
        )}
        style={{
          transition: isResizing ? "none" : undefined
        }}
      >
        <SidebarContent className="scrollbar-hide">
          <SidebarGroup>
            <div className="flex items-center">
              {sidebarWidth > 100 && (
                <SidebarGroupLabel className="text-sm truncate">
                  {compresedTitle}
                </SidebarGroupLabel>
              )}
              {sidebarWidth > 60 && (
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
              )}
            </div>
          </SidebarGroup>

          <SidebarGroupContent className={cn(sidebarWidth < 50 && "hidden")}>
            <FileTree path="" level={0} data={templatePlaygroundSelector} />
          </SidebarGroupContent>
        </SidebarContent>
      </Sidebar>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-[-4px] top-0 z-50 h-full w-2 cursor-col-resize"
      />
    </div>
  );
};