import z from "zod";

export const authFormSchema = z.object({
  username: z.string().min(3, "Username must contain at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  email:    z.string().email(),
  password: z.string().min(6, "Password must contain at least 6 characters")
});

export const validateAuthForm = authFormSchema.safeParse;

export const validatePartialAuthForm = authFormSchema.partial().safeParse;