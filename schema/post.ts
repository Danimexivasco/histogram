import z from "zod";

export const postSchema = z.object({
  id:         z.string(),
  user_id:    z.string(),
  media:      z.string().array(),
  caption:    z.string().optional(),
  created_at: z.string().optional()
});

export type Post = z.infer<typeof postSchema>;

export const validatePost = postSchema.safeParse;

