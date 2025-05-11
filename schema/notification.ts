import z from "zod";

export const notificationSchema = z.object({
  id:           z.number().int().positive(),
  type:         z.enum(["like", "comment", "follow"]),
  from_user_id: z.string().uuid(),
  to_user_id:   z.string().uuid(),
  post_id:      z.number().int().positive(),
  read:         z.boolean().default(false),
  created_at:   z.string().default(() => new Date().toISOString())
});

export type Notification = z.infer<typeof notificationSchema>;

export const validateNotification = notificationSchema.safeParse;