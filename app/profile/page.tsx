"use client";

import {
  useGetProfile,
  useUpdateProfile,
  useUploadAvatar
} from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { useAuthUser } from "@/hooks/useAuth";
import Container from "@/components/Container";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useActionState, useEffect, useRef, useState } from "react";

import { isErrorType, ToastService } from "@/services/Toast";
import { Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

function LoadingUI() {
  return (
    <Container className="flex flex-col items-center py-12 space-y-6 text-center mx-auto">
      <Skeleton className="h-16 w-16 rounded-full" />
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

export default function ProfilePage() {
  const router = useRouter();
  const { data: authUser } = useAuthUser();
  const { data: profile, isFetching, error } = useGetProfile(authUser?.id ?? "");
  const profileUpdateMutation = useUpdateProfile();
  const avatarUploadMutation = useUploadAvatar();
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url);
  const [uploadingImg, setUploadingImg] = useState(false);
  const labelRef = useRef<HTMLLabelElement>(null);

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

  if (isFetching) return <LoadingUI />;

  if (error) {
    return <p className="text-center text-destructive">Could not load profile.</p>;
  }

  return profile && (
    <Container className="py-12 mx-auto">
      <form
        action={submitAction}
        className="max-w-md mx-auto space-y-6 text-center"
      >
        <div className="relative flex justify-center">
          {uploadingImg ? (
            <Avatar className="mx-auto h-24 w-24">
              <AvatarImage
                src=""
                alt={`${profile.username} avatar`}
              />
              <AvatarFallback><Spinner /></AvatarFallback>
            </Avatar>
          ) : (
            <>
              <Label
                htmlFor="avatar"
                className="h-24 w-24 cursor-pointer"
                ref={labelRef}
              >
                <Avatar className="mx-auto h-24 w-24">
                  <AvatarImage
                    src={avatarUrl ?? ""}
                    alt={`${profile.username} avatar`}
                  />
                  <AvatarFallback className="text-3xl">{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
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
            defaultValue={profile?.email}
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
            id="bio"
            name="bio"
            placeholder="Write your cool bio here ✍🏼"
            defaultValue={profile?.bio ?? ""}
          />
        </div>
        <div className="flex flex-wrap justify-end gap-4">
          <Button
            type="submit"
            disabled={isPending || uploadingImg}
          >{isPending ? "Updating..." : "Update"}
          </Button>
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => router.back()}
          >Cancel
          </Button>
        </div>
      </form>
    </Container>
  );
}
