"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validatePartialAuthForm } from "@/schema/authForm";
import { Label } from "@/components/ui/Label";
import { isErrorType, ToastService } from "@/services/Toast";
import { useResetPasswordForEmail } from "@/hooks/useAuth";

const FORM_INITIAL_STATE = {
  email: ""
};

type ForgotPasswordForm = typeof FORM_INITIAL_STATE;

export default function ForgotPasswordPage() {
  const resetPasswordMutation = useResetPasswordForEmail();
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleSubmit = async (_prevState: Record<string, string> | undefined, formData: FormData) => {
    const inputs: Record<string, string> = {};

    Object.keys(FORM_INITIAL_STATE).forEach((key) => {
      inputs[key] = (formData.get(key) as string)?.trim();
    });

    const { error } = validatePartialAuthForm(inputs);

    if (error) {
      setErrors(error.formErrors.fieldErrors);
      return inputs;
    }

    try {
      await resetPasswordMutation.mutateAsync(inputs as ForgotPasswordForm);
      setErrors(null);
      ToastService.success("Password reset link sent to your email");

    } catch (error) {
      if (isErrorType(error)) ToastService.error(error.message);
    }
  };

  const [actionState, submitAction, isPending] = useActionState(handleSubmit, FORM_INITIAL_STATE);

  return (
    <div className="max-w-sm mx-auto py-12 space-y-4">
      <h1 className="text-xl font-bold">Forgot Password</h1>
      <form action={submitAction}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="johndoe@example.com"
              defaultValue={actionState?.email}
            />
            {errors?.email && <small className="text-red-500">{errors.email[0]}</small>}
          </div>
          <Button
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </div>
  );
}