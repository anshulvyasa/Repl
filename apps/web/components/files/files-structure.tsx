"use client";

import { useSelectedPlaygroundInfo } from "@/lib/redux/selectoranddispatcher/useUpdateSelectedPlaygroundInfo";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuAction } from "../ui/sidebar";
import { useTemplatePlayground } from "@/lib/redux/selectoranddispatcher/useTemplatePlayground";
import { useMemo } from "react";
import FileTree from "./file-tree";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FilePlus, FolderPlus, Plus } from "lucide-react";

export const TemplateFileTree = () => {
  const { selectedPlayground } = useSelectedPlaygroundInfo();
  const { templatePlaygroundSelector } = useTemplatePlayground();

  const compresedTitle = useMemo(() => {
    return selectedPlayground?.title.substring(0, 30);
  }, [selectedPlayground?.title])


  return <Sidebar >
    <SidebarContent>
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
  </Sidebar>
};
