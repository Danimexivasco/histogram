import z from "zod";

export const userSchema = z.object({
  username:   z.string().min(3, "Username must contain at least 3 characters"),
  email:      z.string().email(),
  avatar_url: z.string().url().optional()
});

export const validateUser = userSchema.safeParse;