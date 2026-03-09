import { TemplateFileSchema } from "@repo/zod/files";
import { z } from 'zod';

export const ModifiedFileSelectedSchema = z.object({
    file: TemplateFileSchema,
    isModified: z.boolean(),
    monacoUri: z.string(),
    path: z.array(z.string()),
});

export const FilesSelectedSchema = z.object({
    globallySelectedFile: z.string().nullable(),
    allgloballySelectedFile: z.record(z.string(), ModifiedFileSelectedSchema),
});

export type ModifiedFileSelected = z.infer<typeof ModifiedFileSelectedSchema>;
export type FilesSelected = z.infer<typeof FilesSelectedSchema>;