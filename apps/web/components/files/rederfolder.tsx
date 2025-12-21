import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files";
import { useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from "../ui/sidebar";
import { ChevronRight, Folder } from "lucide-react";
import FilesOperation from "./file-operation";
import FileTree from "./file-tree";
import { RenameFiles } from "./rename-files";
import { DeleteFilesComp } from "./delete-files";
import { CreateFilesOrFolder } from "./createFiles";

export const RenderFolder = ({
    folder,
    level,
    path,
    handleRename,
    handleDelete,
    handleAdd
}: {
    folder: TemplateFolder;
    level: number;
    path: string;
    addFilesState?: boolean
    handleRename: (val: string, newPath: string) => void;
    handleDelete: (newPath: string) => void;
    handleAdd: (data: TemplateItem, path: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(level < 1);
    const [renameState, setRenameState] = useState<boolean>(false);
    const [localSelected, setLocalSelected] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<boolean>(false);
    const [createFileFolderValue, setCreateFileFolderValue] = useState<null | TemplateFile | TemplateFolder>(null);

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

            {renameState ?
                <SidebarMenuItem className="w-full">
                    <SidebarMenuButton>
                        <ChevronRight
                            className={`mr-2 size-4}`}
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
                    </SidebarMenuButton>
                </SidebarMenuItem> :
                <SidebarMenuItem className="group/item">
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                            <ChevronRight
                                className={`mr-2 transition-transform ${isOpen ? "rotate-90" : ""}`}
                            />
                            <Folder className="h-4 w-4 mr-2 shrink-0" />
                            <span>{folder.folderName}</span>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>


                    {!renameState && (
                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <FilesOperation
                                isFolder={true}
                                setRenameState={setRenameState}
                                setDeleteState={setDeleteState}
                                setCreateFileFolderValue={setCreateFileFolderValue}
                                folder={folder} setCollapseOpen={setIsOpen} />
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
                </SidebarMenuItem>}


            <CollapsibleContent>
                <SidebarMenuSub>
                    {createFileFolderValue && "folderName" in createFileFolderValue &&
                        <CreateFilesOrFolder
                            path={`${path}/${folder.folderName}`}
                            createFileFolderValue={createFileFolderValue}
                            setCreateFileFolderValue={setCreateFileFolderValue}
                            handleAdd={handleAdd} />}
                    {folder.items.map((item, index) => (
                        <FileTree
                            key={index}
                            path={`${path}/${folder.folderName}`}
                            level={level + 1}
                            data={item}
                        />
                    ))}
                    {createFileFolderValue && "fileName" in createFileFolderValue &&
                        <CreateFilesOrFolder
                            path={`${path}/${folder.folderName}`}
                            createFileFolderValue={createFileFolderValue}
                            setCreateFileFolderValue={setCreateFileFolderValue}
                            handleAdd={handleAdd} />}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible >
    );
};
