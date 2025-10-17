import z from "zod";

export const createPlaygroundSchema = z.object({
  title: z.string(),
  description: z.string(),
  template: z.enum(["REACT", "NEXT", "EXPRESS", "ANGULAR", "VUE", "HONO"]),
});

const userSchema = z.object({
  createdAt: z.string(),
  email: z.string(),
  emailVerified: z.string().nullable(),
  id: z.string(),
  image: z.string().nullable(),
  name: z.string().nullable(),
  role: z.string(),
  updatedAt: z.string(),
});

export const playGroundSchemaForClient = z.array(
  z.object({
    createdAt: z.string(),
    description: z.string(),
    id: z.string(),
    starmark: z.array(z.object({ isMarked: z.boolean() })),
    template: z.string(),
    title: z.string(),
    updatedAt: z.string(),
    user: userSchema,
  })
);
export type createPlaygroundSchemaType = z.infer<typeof createPlaygroundSchema>;
export type playgroundTypeForFrontend = z.infer<
  typeof playGroundSchemaForClient
>;

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
