import { Edit3, FilePlus, FolderPlus, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";
import React from "react";
import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files";


interface FileOperationProps {
  isFolder: boolean;
  setRenameState: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteState: React.Dispatch<React.SetStateAction<boolean>>
  setCreateFileFolderValue?: React.Dispatch<React.SetStateAction<null | TemplateFile | TemplateFolder>>
  folder?: TemplateFolder;
  setCollapseOpen?: React.Dispatch<React.SetStateAction<boolean>>
}


const calFileName = (item: TemplateItem): { name: string; isFile: boolean } => {
  if ("fileName" in item) {
    return { name: item.fileName, isFile: true };
  } else {
    return { name: item.folderName, isFile: false };
  }
};


const parseUntitledNumber = (name: string): number | null => {
  const re = /^untitled(?:[-.\s]?(\d+))?$/i;
  const m = name.trim().match(re);
  if (!m) return null;
  if (!m[1]) return 1;
  const n = parseInt(m[1], 10);
  return Number.isFinite(n) ? n : 1;
};

export const calcNewFileOrFolderName = (folder: TemplateFolder): string => {
  const set = new Set<number>();

  for (const item of folder.items) {
    const { name } = calFileName(item);
    const parsed = parseUntitledNumber(name);
    if (parsed !== null) {
      set.add(parsed);
    }
  }

  const sorted = [...set].sort((a, b) => a - b);

  let want = 1;
  for (const n of sorted) {
    if (n === want) {
      want++;
    } else if (n > want) {
      break; 
    } 
  }

  if (want === 1) return "Untitled";
  return `Untitled-${want}`;
};


const FilesOperation = ({ isFolder, setRenameState, setDeleteState, setCreateFileFolderValue, folder, setCollapseOpen }: FileOperationProps) => {

  const handleFileCreatingValueUpdate = () => {
    if (!setCollapseOpen || !setCreateFileFolderValue || !folder) return;

    const newFileName = calcNewFileOrFolderName(folder)
    const newFile: TemplateFile = {
      fileName: newFileName,
      fileExtension: "",
      content: ""
    }

    setCollapseOpen(true)
    setCreateFileFolderValue(newFile);
  }

  const handleFolderCreatingValueUpdate = () => {
    if (!setCollapseOpen || !setCreateFileFolderValue || !folder) return;

    const newFolderName = calcNewFileOrFolderName(folder);
    const newFolder: TemplateFolder = {
      folderName: newFolderName,
      items: []
    }
    setCollapseOpen(true)
    setCreateFileFolderValue(newFolder);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <Plus className="h-4 w-4" />
        </SidebarMenuAction>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isFolder && <>
          <DropdownMenuItem onClick={() => handleFileCreatingValueUpdate()}>
            <FilePlus className="h-4 w-4 mr-2" />
            <span>Add File</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleFolderCreatingValueUpdate()}>
            <FolderPlus className="h-4 w-4 mr-2" />
            <span>Add Folder</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator /></>}
        <DropdownMenuItem onClick={() => setRenameState(true)}>
          <Edit3 className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeleteState(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilesOperation;
