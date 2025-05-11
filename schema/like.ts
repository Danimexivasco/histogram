import z from "zod";

export const likeSchema = z.object({
  id:         z.string(),
  user_id:    z.string(),
  post_id:    z.string(),
  created_at: z.string()
});

export type Like = z.infer<typeof likeSchema>;

export const validateLike = likeSchema.safeParse;