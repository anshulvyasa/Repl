import { Edit3, FilePlus, FolderPlus, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenuAction } from "../ui/sidebar";

interface FileOperationProps {
  isFolder: boolean;
}

const FilesOperation = ({ isFolder }: FileOperationProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <Plus className="h-4 w-4" />
        </SidebarMenuAction>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {isFolder && <><DropdownMenuItem>
          <FilePlus className="h-4 w-4 mr-2" />
          <span>Add File</span>
        </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderPlus className="h-4 w-4 mr-2" />
            <span>Add Folder</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator /></>}
        <DropdownMenuItem>
          <Edit3 className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilesOperation;
