import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "../ui/sidebar";
import { ChevronRight, File, Folder } from "lucide-react";
import FilesOperation from "./file-operation";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

interface FileTreeProps {
    path: string;
    level: number;
    data: TemplateItem;
}

const FileTree = ({ path, level, data }: FileTreeProps) => {
    const isFile = "fileName" in data;


    if (isFile) {
        return <RenderFile file={data} />
    }

    return (
        <RenderFolder folder={data} level={level} path={path} />
    )
}

export default FileTree;


const RenderFile = ({ file }: { file: TemplateFile }) => {
    const filename = `${file.fileName}.${file.fileExtension}`;

    return (
        <SidebarMenuItem className="group/item flex items-center justify-between">
            <SidebarMenuButton>
                <File className="h-4 w-4 mr-2 shrink-0" />
                <span>{filename}</span>
            </SidebarMenuButton>

            <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                <FilesOperation />
            </div>
        </SidebarMenuItem>

    );
};


const RenderFolder = ({
    folder,
    level,
    path,
}: {
    folder: TemplateFolder;
    level: number;
    path: string;
}) => {
    const [isOpen, setIsOpen] = useState(level < 2);

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
                    <FilesOperation />
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
