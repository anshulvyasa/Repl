import { TemplateFile } from "@repo/zod/files";
import React, { useEffect, useRef, useState } from "react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { File } from "lucide-react";
import FilesOperation from "./file-operation";

export const RenderFile = ({ file, path, handleRename }: { file: TemplateFile, path: string, handleRename: (newValue: string, newPath: string) => void }) => {
    const originalFilename = `${file.fileName}.${file.fileExtension}`;

    const [renameState, setRenameState] = useState<boolean>(false);
    const [renameValue, setRenameValue] = useState(originalFilename);
    const renameValueRef = useRef<HTMLInputElement>(null);

    const handleRenameOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();

        if (e.key === "Enter") {
            const newPath = `${path}/${originalFilename}`
            handleRename(renameValue, newPath);
            setRenameState(false);
        } else if (e.key === "Escape") {
            setRenameValue(originalFilename)
            setRenameState(false);
        }
    }

    useEffect(() => {
        if (renameState && renameValueRef.current) {
            renameValueRef.current.focus();
            renameValueRef.current.select();
        }
    }, [renameState])

    return (
        <SidebarMenuItem className="group/item flex items-center justify-between">
            <SidebarMenuButton>
                <File className="h-4 w-4 mr-2 shrink-0" />
                {renameState ? <input
                    value={renameValue}
                    type="text"
                    onChange={(e) => setRenameValue(e.target.value)}
                    ref={renameValueRef}
                    onKeyDown={handleRenameOnKeyDown}
                    className="h-6 w-full min-w-0 bg-transparent text-foreground border-0 px-1 py-0 text-sm focus:outline-none"
                    spellCheck={false}
                    autoComplete="off"
                /> :
                    <span>{originalFilename}</span>}
            </SidebarMenuButton>

            {!renameState && <div className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                <FilesOperation isFolder={false} setRenameState={setRenameState} />
            </div>}
        </SidebarMenuItem>
    );
};