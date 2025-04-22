"use client";

import {
  useGetProfile,
  useUpdateProfile,
  useUploadAvatar
} from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthUser, useSignOut } from "@/hooks/useAuth";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useActionState, useEffect, useRef, useState } from "react";

import { isErrorType, ToastService } from "@/services/Toast";
import { Camera, EraserIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";
import Avatar from "@/components/Avatar";
import { Separator } from "@/components/ui/Separator";
import ThemeSwitch from "@/components/ThemeSwitch";
import { BIO_MAX_LENGTH } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { AuthService } from "@/services/Auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/AlertDialog";

function LoadingUI() {
  return (
    <Container className="page-margins flex flex-col items-center py-4 md:py-12 space-y-6 text-center mx-auto">
      <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-64" />
      <div className="max-w-md mx-auto space-y-6">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-80 md:w-96" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-80 md:w-96" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-80 md:w-96" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-12 w-80 md:w-96" />
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-4">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </Container>
  );
}

// TODO: Add max number of characters in bio and counter in the end. Also make it possible to have multiple lines
export default function ProfileConfigPage() {
  const router = useRouter();
  const { data: authUser } = useAuthUser();
  const { data: profile, isFetching, error } = useGetProfile(authUser?.id ?? "");
  const profileUpdateMutation = useUpdateProfile();
  const avatarUploadMutation = useUploadAvatar();
  const singOutMutation = useSignOut();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  const handleBioInput = () => {
    if (bioRef.current) {
      setCharCount(bioRef.current.value.length);
    }
  };

  useEffect(() => {
    if (bioRef.current && charCount === 0) {
      setCharCount(bioRef.current.value.length);
    }
  }, [bioRef.current]);

  useEffect(() => {
    if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
  }, [profile?.avatar_url]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImg(true);

      const formData = new FormData();
      formData.append("user_id", authUser?.id ?? "");
      formData.append("file", file);

      const data = await avatarUploadMutation.mutateAsync(formData);

      setAvatarUrl(data?.avatarUrl ?? "");

      setUploadingImg(false);
    } catch (error) {
      setUploadingImg(false);
      if (isErrorType(error)) ToastService.error(error.message);
    }
  };

  const handleSubmit = async (_prevState: void | undefined, formData: FormData) => {
    try {
      const inputs: Record<string, string> = {};

      if (profile) {
        Object.keys(profile).forEach((key) => {
          if (formData.get(key)) {
            inputs[key] = (formData.get(key) as string)?.trim();
          }
        });

        if (avatarUrl) inputs.avatar_url = avatarUrl;

        await profileUpdateMutation.mutateAsync({
          user_id:    authUser?.id ?? "",
          updated_at: new Date().toISOString(),
          ...inputs
        });
        ToastService.success("Profile updated successfully");
      }
    } catch (error) {
      if (isErrorType(error)) ToastService.error(error.message);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_actionState, submitAction, isPending] = useActionState(handleSubmit, undefined);

  const handleSignOut = async () => {
    await singOutMutation.mutateAsync();
    router.refresh();
  };

  const handleDeleteAccount = async () => {
    try {
      await singOutMutation.mutateAsync();

      await AuthService.deleteUser({
        id: authUser?.id ?? ""
      });

      router.push(routes.home);

      window.location.reload();

      ToastService.success("Account deleted successfully");
    } catch {
      ToastService.error("Error deleting the account");
    }

  };

  if (isFetching) return <LoadingUI />;

  if (error) {
    return <p className="text-center text-destructive">Could not load profile.</p>;
  }

  return profile && (
    <Container className="page-margins py-4 md:py-12 mx-auto space-y-8">
      <form
        action={submitAction}
        className="mx-auto space-y-6 text-center"
      >
        <div className="relative flex justify-center">
          {uploadingImg ? (
            <Avatar
              src={""}
              fallback={<Spinner />}
              className="mx-auto h-24 w-24 min-w-24 min-h-24"
            />
          ) : (
            <>
              <Label
                htmlFor="avatar"
                className="h-24 w-24 cursor-pointer"
                ref={labelRef}
              >
                <Avatar
                  src={avatarUrl}
                  fallback={profile.username?.[0]?.toUpperCase() ?? ""}
                  className="mx-auto h-24 w-24"
                  fallbackClassName="text-3xl"
                  size="lg"
                />
              </Label>
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2  bg-spartan-500 rounded-full p-1.5 text-white cursor-pointer"
                onClick={() => labelRef.current?.click()}
              ><Camera size={16}/>
              </div>
            </>
          )}
          <input
            id="avatar"
            type="file"
            name="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{profile.username ?? profile.fullname}</h2>
          <p className="text-sm text-gray-500">
            Joined: {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="example@gmail.com"
            defaultValue={profile?.email ?? authUser?.email}
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fullname">Full name</Label>
          <Input
            id="fullname"
            type="text"
            name="fullname"
            placeholder="John Doe"
            defaultValue={profile?.fullname}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            name="username"
            placeholder="CoolUsername"
            defaultValue={profile?.username}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            ref={bioRef}
            id="bio"
            name="bio"
            placeholder="Write your cool bio here ✍🏼"
            maxLength={BIO_MAX_LENGTH}
            defaultValue={profile?.bio ?? ""}
            onInput={handleBioInput}
          />
          <small className="text-right">{charCount} / {BIO_MAX_LENGTH}</small>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isPending || uploadingImg}
          >{isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
      <div className="block md:hidden space-y-8">
        <Separator />
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">Theme</p>
          <ThemeSwitch />
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between space-x-8">
        <div className="space-y-2">
          <p className="text-lg font-bold">Log out</p>
          <p>You can log out of your account.</p>
        </div>
        <Button
          variant={"outline"}
          onClick={handleSignOut}
        ><LogOutIcon className="text-spartan-400"/>Log out
        </Button>
      </div>
      <Separator />
      <div className="flex items-center justify-between space-x-8">
        <div className="space-y-2">
          <p className="text-lg font-bold italic">Delete Account</p>
          <p>You can delete your account. Be careful, this action is irreversible!</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
            ><EraserIcon />Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteAccount}
              >
                <EraserIcon />
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Container>
  );
}
