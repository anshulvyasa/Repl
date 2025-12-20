import z from "zod";

export const AddFileFolderAndRenameFileFolderSchema = z.object({
    playgroundId: z.string().nonempty(),
    path: z.string().nonempty(),
    newName: z.string().nonempty()
})

export const DeleteFileFolderSchema = z.object({
    playgroundId: z.string().nonempty(),
    path: z.string().nonempty(),
})

export const FileOperationSchema = z.union([
    AddFileFolderAndRenameFileFolderSchema, DeleteFileFolderSchema
])

export type AddFileFolderAndRenameFileFolderSchemaType = z.infer<typeof AddFileFolderAndRenameFileFolderSchema>;
export type DeleteFileFolderSchemaType = z.infer<typeof DeleteFileFolderSchema>;
export type FileOperationSchemaType = z.infer<typeof FileOperationSchema>;


export const FileOperationSchemaQueue = z.object({
    items: z.array(FileOperationSchema),
    head: z.number()
})

export type FileOperationSchemaQueueType = z.infer<typeof FileOperationSchemaQueue>;