import { TemplateFolder } from "@repo/zod/files";
import { useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "../ui/sidebar";
import { ChevronRight, Folder } from "lucide-react";
import FilesOperation from "./file-operation";
import FileTree from "./file-tree";
import { RenameFiles } from "./rename-files";
import { DeleteFilesComp } from "./delete-files";

export const RenderFolder = ({
    folder,
    level,
    path,
    handleRename,
    handleDelete
}: {
    folder: TemplateFolder;
    level: number;
    path: string;
    handleRename: (val: string, newPath: string) => void;
    handleDelete: (newPath: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const [renameState, setRenameState] = useState<boolean>(false);
    const [localSelected, setLocalSelected] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<boolean>(false);

    const componentRef = useRef<HTMLDivElement>(null);

    const handleLocalSelected = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (localSelected) {
            setRenameState(true);
            return;
        }
        setLocalSelected(true);
        setTimeout(() => { setLocalSelected(false) }, 300)
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (componentRef.current && componentRef.current.contains(event.target as Node)) {
                return;
            }
            setRenameState(false);
            setLocalSelected(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            ref={componentRef}
            onClick={!renameState ? handleLocalSelected : undefined}
        >
            <SidebarMenuItem className="group/item">
                {renameState ? (
                    <div className="flex w-full items-center gap-2 pl-2 p-1">
                        <ChevronRight
                            className={`mr-2 size-5 transition-transform ${isOpen ? "rotate-90" : ""}`}
                        />
                        <Folder className="h-4 w-4 shrink-0 " />

                        <div className="ml-1">
                            <RenameFiles
                                path={path}
                                originalName={folder.folderName}
                                handleRename={handleRename}
                                renameState={renameState}
                                setRenameState={setRenameState}
                                setLocalSelected={setLocalSelected}
                            />
                        </div>
                    </div>
                ) : (
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ChevronRight
                                className={`mr-2 transition-transform ${isOpen ? "rotate-90" : ""}`}
                            />
                            <Folder className="h-4 w-4 mr-2 shrink-0" />
                            <span>{folder.folderName}</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                )}

                {!renameState && (
                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <FilesOperation isFolder={true} setRenameState={setRenameState} setDeleteState={setDeleteState} />
                    </div>
                )}

                <DeleteFilesComp
                    deleteState={deleteState}
                    setDeleteState={setDeleteState}
                    handleDelete={handleDelete}
                    isFile={false}
                    originalName={folder.folderName}
                    newPath={`${path}/${folder.folderName}`}
                />
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
