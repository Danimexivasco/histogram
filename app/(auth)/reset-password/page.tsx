"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { isErrorType, ToastService } from "@/services/Toast";
import { validateResetPassword } from "@/schema/resetPassword";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { useUpdatePassword } from "@/hooks/useAuth";

const FORM_INITIAL_STATE = {
  password:        "",
  confirmPassword: ""
};

export default function ResetPasswordPage() {
  const updatePasswordMutation = useUpdatePassword();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleSubmit = async (_prevState: Record<string, string> | undefined, formData: FormData) => {
    const inputs: Record<string, string> = {};

    Object.keys(FORM_INITIAL_STATE).forEach((key) => {
      inputs[key] = (formData.get(key) as string)?.trim();
    });

    const { error } = validateResetPassword(inputs);

    if (error) {
      setErrors(error.formErrors.fieldErrors);
      return inputs;
    }

    if (inputs.password !== inputs.confirmPassword) {
      ToastService.error("Passwords do not match");
      return inputs;
    }

    try {
      await updatePasswordMutation.mutateAsync({
        password: inputs.password
      });
      setErrors(null);
      ToastService.success("Password updated successfully");
      router.push(routes.login);

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
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              defaultValue={actionState?.password}
            />
            {errors?.password && <small className="text-red-500">{errors.password[0]}</small>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm your password</Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              defaultValue={actionState?.confirmPassword}
            />
            {errors?.confirmPassword && <small className="text-red-500">{errors.confirmPassword[0]}</small>}
          </div>
          <Button
            disabled={isPending}
          >
            {isPending ? "Sending the request..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
