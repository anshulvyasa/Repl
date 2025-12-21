import React, { useEffect, useRef, useState } from "react";

interface RenameFilesType {
    originalName: string;
    handleRename: (val: string, newPath: string) => void;
    path: string;
    renameState: boolean
    setRenameState: React.Dispatch<React.SetStateAction<boolean>>
    setLocalSelected: React.Dispatch<React.SetStateAction<boolean>>
}


export const RenameFiles = ({ originalName, handleRename, path, renameState, setRenameState, setLocalSelected }: RenameFilesType) => {
    const [renameValue, setRenameValue] = useState(originalName);
    const renameValueRef = useRef<HTMLInputElement>(null);

    const handleRenameOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();

        if (e.key === "Enter") {
            const newPath = `${path}/${originalName}`
            handleRename(renameValue, newPath);
            setRenameState(false);
        } else if (e.key === "Escape") {
            setRenameValue(originalName)
            setRenameState(false);
        }
        setLocalSelected(false);
    }

    useEffect(() => {
        if (renameState && renameValueRef.current) {
            renameValueRef.current.focus();
            renameValueRef.current.select();
        }
    }, [renameState])

    return <input
        value={renameValue}
        type="text"
        onChange={(e) => setRenameValue(e.target.value)}
        ref={renameValueRef}
        onKeyDown={handleRenameOnKeyDown}
        className="h-6 w-full overflow-hidden min-w-0 bg-transparent text-foreground border-0 px-1 py-0 text-sm focus:outline-none"
        spellCheck={false}
        autoComplete="off"
    />
}