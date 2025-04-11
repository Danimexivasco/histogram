"use client";

import { useSignUp } from "@/hooks/useAuth";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { isErrorType, ToastService } from "@/services/Toast";
import { validateAuthForm } from "@/schema/authForm";
import Image from "next/image";
import { caesarDressing } from "@/assets/fonts";
import clsx from "clsx";
import { routes } from "@/lib/routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Container from "@/components/Container";
import Link from "@/components/ui/Link";
import ThemeSwitch from "@/components/ThemeSwitch";

const FORM_INITIAL_STATE = {
  email:    "",
  password: "",
  username: ""
};

type RegisterForm = typeof FORM_INITIAL_STATE;

export default function RegisterPage() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleSubmit = async (_prevState: Record<string, string> | undefined, formData: FormData) => {
    const inputs: Record<string, string> = {};

    Object.keys(FORM_INITIAL_STATE).forEach((key) => {
      inputs[key] = (formData.get(key) as string)?.trim();
    });

    const { error } = validateAuthForm(inputs);

    if (error) {
      setErrors(error.formErrors.fieldErrors);
      return inputs;
    }

    try {
      await signUpMutation.mutateAsync(inputs as RegisterForm);
      setErrors(null);
      ToastService.success("User created successfully");
      router.push(routes.confirmEmail);

    } catch (error) {
      if (isErrorType(error)) {
        ToastService.error(error.message);
      }
    }
  };

  const [actionState, submitAction, isPending] = useActionState(handleSubmit, FORM_INITIAL_STATE);

  return (
    <Container className="flex flex-col items-center justify-center h-screen">
      <ThemeSwitch className="absolute top-4 right-4"/>
      <div className="flex flex-col gap-6 min-w-80 md:min-w-96">
        <div className="grid justify-items-center gap-2">
          <Image
            src={"/histogram.png"}
            alt="Histogram"
            width={120}
            height={120}
          />
          <h1 className={clsx("text-4xl font-bold", caesarDressing.className)}>Histogram</h1>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign up</CardTitle>
            <CardDescription>Sign up to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitAction}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      name="username"
                      placeholder="CoolUsername"
                      defaultValue={actionState?.username}
                    />
                    {errors?.username && <small className="text-red-500">{errors.username[0]}</small>}
                  </div>
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
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Password with at least 6 characters"
                      defaultValue={actionState?.password}
                    />
                    {errors?.password && <small className="text-red-500">{errors.password[0]}</small>}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    disabled={isPending}
                  >
                    Register
                  </Button>
                </div>
                <div className="text-center text-sm">
                  You already have an account?{" "}
                  <Link href={routes.login}>Login</Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
