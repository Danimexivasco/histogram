import z from "zod";

export const resetPasswordSchema = z.object({
  password:        z.string().min(6, "Password must contain at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must contain at least 6 characters")
});

export const validateResetPassword = resetPasswordSchema.safeParse;