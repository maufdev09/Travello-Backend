import z from "zod";

export const createGuidezodSchema = z.object({
  password: z.string(),
  data: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.email(),
    address: z.string().optional(),
  }),
});
