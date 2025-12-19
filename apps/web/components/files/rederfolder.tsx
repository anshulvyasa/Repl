import { TemplateFolder } from "@repo/zod/files";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "../ui/sidebar";
import { ChevronRight, Folder } from "lucide-react";
import FilesOperation from "./file-operation";
import FileTree from "./file-tree";

export const RenderFolder = ({
    folder,
    level,
    path
}: {
    folder: TemplateFolder;
    level: number;
    path: string;
}) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const [renameState, setRenameState] = useState<boolean>(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <SidebarMenuItem className="group/item">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight
                            className={`mr-2 transition-transform ${isOpen ? "rotate-90" : ""
                                }`}
                        />
                        <Folder className="h-4 w-4 mr-2 shrink-0" />
                        <span>{folder.folderName}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <FilesOperation isFolder={true} setRenameState={setRenameState} />
                </div>
            </SidebarMenuItem>


            <CollapsibleContent>
                <SidebarMenuSub>
                    {folder.items.map((item, index) => (
                        <FileTree
                            key={index}
                            path={`${path}/${folder.folderName}`}
                            level={level + 1}
                            data={item}
                        />
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    );
};
