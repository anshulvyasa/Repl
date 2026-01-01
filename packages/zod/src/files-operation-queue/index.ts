import z from "zod";
import { TemplateItemSchema } from "@repo/zod/files";

function stripRoot(path: string[]): string[] {
  return path.slice(1); 
}


export const RenameFileFolderSchema = z.object({
    playgroundId: z.string().nonempty(),
    path: z.string().nonempty(),
    newName: z.string().nonempty()
})

export const AddFileFolderSchema = z.object({
    playgroundId: z.string().nonempty(),
    path: z.string().nonempty(),
    data: TemplateItemSchema
})

export const DeleteFileFolderSchema = z.object({
    playgroundId: z.string().nonempty(),
    path: z.string().nonempty(),
})

export const FileOperationSchema = z.union([
    AddFileFolderSchema,
    RenameFileFolderSchema,
    DeleteFileFolderSchema,
])

export type RenameFileFolderSchemaType = z.infer<typeof RenameFileFolderSchema>;
export type DeleteFileFolderSchemaType = z.infer<typeof DeleteFileFolderSchema>;
export type FileOperationSchemaType = z.infer<typeof FileOperationSchema>;
export type AddFileFolderSchemaType = z.infer<typeof AddFileFolderSchema>;


export const FileOperationSchemaQueue = z.object({
    items: z.array(FileOperationSchema),
    head: z.number()
})

export type FileOperationSchemaQueueType = z.infer<typeof FileOperationSchemaQueue>;