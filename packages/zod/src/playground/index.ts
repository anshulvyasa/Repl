import z from "zod";

export const createPlaygroundSchema = z.object({
  title: z.string(),
  description: z.string(),
  template: z
    .enum(["REACT", "NEXT", "EXPRESS", "ANGULAR", "VUE", "HONO"])
    .optional(),
});
