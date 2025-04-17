import { BIO_MAX_LENGTH } from "@/lib/constants";
import z from "zod";

export const profileSchema = z.object({
  id:       z.string(),
  user_id:  z.string(),
  email:    z.string().email(),
  username: z.string() .min(3, "Username must contain at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"),
  fullname:   z.string().optional(),
  bio:        z.string().max(BIO_MAX_LENGTH, "Username must not exceed 30 characters").optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export type Profile = z.infer<typeof profileSchema>;

export const validateProfile = profileSchema.safeParse;

export const validatePartialProfile = profileSchema.partial().safeParse;
