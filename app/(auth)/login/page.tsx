"use client";

import { useSignIn, useSignInWithGoogle } from "@/hooks/useAuth";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { validatePartialAuthForm } from "@/schema/authForm";
import { isErrorType, ToastService } from "@/services/Toast";
import Image from "next/image";
import clsx from "clsx";
import { caesarDressing } from "@/assets/fonts";
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
import { GoogleIcon } from "@/assets/icons/google";
import ThemeSwitch from "@/components/ThemeSwitch";

const FORM_INITIAL_STATE = {
  email:    "",
  password: ""
};

type LoginForm = typeof FORM_INITIAL_STATE;

export default function SignInPage() {
  const router = useRouter();
  const signInMutation = useSignIn();
  const googleSignInMutation = useSignInWithGoogle();

  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleSignInWithGoogle = async () => {
    try {
      await googleSignInMutation.mutateAsync();
    } catch (error) {
      if (isErrorType(error)) ToastService.error(error.message);
    }
  };

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
      await signInMutation.mutateAsync(inputs as LoginForm);
      setErrors(null);
      router.push(routes.home);

    } catch (error) {
      if (isErrorType(error)) ToastService.error(error.message);
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
            className="w-20 h-20 md:w-32 md:h-32"
          />
          <h1 className={clsx("text-4xl font-bold", caesarDressing.className)}>Histogram</h1>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>
              Login with your Google account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitAction}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleSignInWithGoogle}
                  >
                    <GoogleIcon />
                    Login with Google
                  </Button>
                </div>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
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
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href={routes.forgotPassword}
                        className="ml-auto text-sm underline-offset-4 no-underline hover:underline"
                      >Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      defaultValue={actionState?.password}
                    />
                    {errors?.password && <small className="text-red-500">{errors.password[0]}</small>}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isPending}
                  >
                    Login
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href={routes.register}>Register</Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
