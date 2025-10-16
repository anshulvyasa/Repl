import z from "zod";

export const createPlaygroundSchema = z.object({
  title: z.string(),
  description: z.string(),
  template: z.enum(["REACT", "NEXT", "EXPRESS", "ANGULAR", "VUE", "HONO"]),
});

export type createPlaygroundSchemaType = z.infer<typeof createPlaygroundSchema>;

export const TemplateDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  popularity: z.number().min(0).max(5),
  ratingCount: z.number().int().nonnegative(),
  tags: z.array(z.string()),
  features: z.array(z.string()),
  category: z.enum(["frontend", "backend", "fullstack"]),
});
