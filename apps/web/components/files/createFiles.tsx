import { TemplateFile, TemplateFolder, TemplateItem } from "@repo/zod/files"
import { ChevronRight, File, Folder } from "lucide-react"
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface CreateFilesOrFolderType {
    path: string
    createFileFolderValue: TemplateItem
    setCreateFileFolderValue: React.Dispatch<React.SetStateAction<null | TemplateFile | TemplateFolder>>
    handleAdd: (data: TemplateItem, path: string) => void
}

const calcNewFile = (data: TemplateItem, fileName: string) => {
    let newFile;
    if ("fileName" in data) {
        newFile = { ...data, fileName: fileName }
    }
    else {
        newFile = { ...data, folderName: fileName }
    }
    return newFile;
}

export const CreateFilesOrFolder = ({ path, createFileFolderValue, setCreateFileFolderValue, handleAdd }: CreateFilesOrFolderType) => {
    const [fileName, setFileName] = useState<string>("fileName" in createFileFolderValue ? createFileFolderValue.fileName : createFileFolderValue.folderName);
    const inputRef = useRef<HTMLInputElement>(null);
    const elementRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (!elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();

            const isInside =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;

            if (!isInside) {
                const newFile = calcNewFile(createFileFolderValue, fileName);
                handleAdd(newFile, path);
                setCreateFileFolderValue(null);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                const newFile = calcNewFile(createFileFolderValue, fileName);
                handleAdd(newFile, path);
                setCreateFileFolderValue(null);
            }

            if (e.key === "Escape") {
                setCreateFileFolderValue(null);
            }
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [fileName, createFileFolderValue, path, handleAdd, setCreateFileFolderValue]);



    useLayoutEffect(() => {
        const el = inputRef.current;
        if (!el) return;

        if (document.activeElement === el) return;

        el.focus();
        el.select();
    });

    return (
        <SidebarMenuItem className="w-full" ref={elementRef}>
            <SidebarMenuButton>
                {"fileName" in createFileFolderValue ?
                    <File className="h-4 w-4 mr-2 shrink-0" /> :
                    <React.Fragment>
                        <ChevronRight className={`mr-2 size-5 transition-transform`} />
                        <Folder className="h-4 w-4 shrink-0 " />
                    </React.Fragment>}
                <input
                    ref={inputRef}
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="overflow-hidden w-full focus:outline-none"
                />
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}