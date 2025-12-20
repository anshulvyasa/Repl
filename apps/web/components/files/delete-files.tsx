import React from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"

interface DeleteFilesCompType {
    deleteState: boolean,
    setDeleteState: React.Dispatch<React.SetStateAction<boolean>>
    newPath: string;
    handleDelete: (newPath: string) => void;
    isFile: boolean
    originalName: string;
}


export const DeleteFilesComp = ({ deleteState, setDeleteState, newPath, handleDelete, originalName, isFile }: DeleteFilesCompType) => {
    return <AlertDialog open={deleteState} onOpenChange={setDeleteState}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    Are you sure to delete this &apos;{originalName}&apos; {isFile ? "file" : "folder"}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter >
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(newPath)} className="hover:bg-red-600 bg-red-500 cursor-pointer text-white dark:text-white " >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}