import z from "zod";

export interface TemplateFile {
  fileName: string;
  fileExtension: string;
  content: string;
}

export interface TemplateFolder {
  folderName: string;
  items: (TemplateFile | TemplateFolder)[];
}

export type TemplateItem = TemplateFile | TemplateFolder;

export const TemplateFileSchema = z.object({
  fileName: z.string(),
  fileExtension: z.string(),
  content: z.string(),
});

export const TemplateFolderSchema: z.ZodType<TemplateFolder> = z.lazy(() =>
  z.object({
    folderName: z.string(),
    items: z.array(z.union([TemplateFileSchema, TemplateFolderSchema])),
  })
);

export type TemplateFolderSchemaType = z.infer<typeof TemplateFolderSchema>;

export const TemplateItemSchema = z.union([
  TemplateFileSchema,
  TemplateFolderSchema,
]);