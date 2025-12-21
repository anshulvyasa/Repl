import { TemplateFile, TemplateItem } from "@repo/zod/files";
import React, { useEffect, useRef, useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { File } from "lucide-react";
import FilesOperation from "./file-operation";
import { RenameFiles } from "./rename-files";
import { DeleteFilesComp } from "./delete-files";



export const RenderFile = ({
    file,
    path,
    handleRename,
    handleDelete,
}: {
    file: TemplateFile,
    path: string,
    handleRename: (newValue: string, newPath: string) => void
    handleDelete: (newPath: string) => void;
}) => {
    const originalFilename = file.fileExtension ? `${file.fileName}.${file.fileExtension}` : file.fileName;
    const [renameState, setRenameState] = useState<boolean>(false);
    const [localSelected, setLocalSelected] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<boolean>(false);

    const componentRef = useRef<HTMLLIElement>(null);

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
        <SidebarMenuItem
            ref={componentRef}
            className={`group/item flex items-center justify-between rounded-lg`}
            onClick={handleLocalSelected}
        >
            <SidebarMenuButton className="w-full">
                <File className="h-4 w-4 mr-2 shrink-0" />
                {renameState ? (
                    <RenameFiles
                        path={path}
                        handleRename={handleRename}
                        originalName={originalFilename}
                        renameState={renameState}
                        setRenameState={setRenameState}
                        setLocalSelected={setLocalSelected}
                    />
                ) : (
                    <span>{originalFilename}</span>
                )}
            </SidebarMenuButton>
            <DeleteFilesComp
                setDeleteState={setDeleteState}
                deleteState={deleteState}
                handleDelete={handleDelete}
                newPath={`${path}/${originalFilename}`}
                isFile={true} originalName={originalFilename} />

            {!renameState && (
                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                    <FilesOperation isFolder={false} setRenameState={setRenameState} setDeleteState={setDeleteState} />
                </div>
            )}
        </SidebarMenuItem>
    );
};