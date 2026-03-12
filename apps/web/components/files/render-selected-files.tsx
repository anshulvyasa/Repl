"use client";

import { X } from "lucide-react";
import { useGlobalSelectedFile } from "@/lib/redux/selectoranddispatcher/useGlobalSelectedFile";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { useState } from "react";
import { AlertDialogHeader } from "../ui/alert-dialog";
// import { removeFile, updateGloballySelectedFile } from "";

export const GloballySelectedFiles = () => {
    const dispatch = useDispatch();
    const { allgloballySelectedFile, globallySelectedFile, updateGlobalSelectedFile, removeOldGlobalSelectedFile } =
        useGlobalSelectedFile();
    const [isRemoveDialogOpen,setIsRemoveDialogOpen]=useState(false);

    const files = Object.values(allgloballySelectedFile);

    if (files.length === 0) return null;

    return (
        <div className="w-full flex items-center bg-muted border-b border-border overflow-x-auto scrollbar-hide">
            {files.map((file) => {
                const isActive = file.monacoUri === globallySelectedFile;

                return (
                    <div
                        key={file.monacoUri}
                        onClick={() => {
                            updateGlobalSelectedFile(file.monacoUri)
                        }
                        }
                        className={`group flex items-center gap-2 px-4 py-2  border-r border-border  cursor-pointer transition-colors ${isActive
                            ? "bg-background text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}
                    >
                        {/* File Name */}
                        <span className="text-sm whitespace-nowrap">
                            {file.file.fileName}.{file.file.fileExtension}
                            {file.isModified && (
                                <span className="ml-2 inline-block rounded-full h-2 w-2 bg-yellow-700" />
                            )}
                        </span>
                        {/* Close Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeOldGlobalSelectedFile(file.monacoUri);
                            }}
                            className={` opacity-0 group-hover:opacity-100 rounded-sm p-0.5 transition-all hover:bg-destructive hover:text-destructive-foreground`}
                        >
                            <X size={14} />
                        </button>

                    </div>
                );
            })}
        </div>
    );
};


