import { FilePlus, FolderPlus, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";

const FilesOperation = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <Plus className="h-4 w-4" />
        </SidebarMenuAction>
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
  );
};

export default FilesOperation;
