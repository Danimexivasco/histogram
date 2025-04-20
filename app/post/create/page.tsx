"use client";

import MediaPreview from "@/components/MediaPreview";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuthUser } from "@/hooks/useAuth";
import { useCreatePost } from "@/hooks/usePosts";
import { CAPTION_MAX_LENGTH } from "@/lib/constants";
import { routes } from "@/lib/routes";
import { isMedia } from "@/lib/utils/mediaCheck";
import { uploadMedia } from "@/lib/utils/uploadMedia";
import { ToastService } from "@/services/Toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

export interface FilePreview {
  url: string;
  type: "image" | "video";
  file: File;
}

export interface UploadProgress {
  [key: number]: "uploading" | "completed" | "error" | null;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { data: user } = useAuthUser();
  const createPostMutation = useCreatePost();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [charCount, setCharCount] = useState(0);

  const onDrop = (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {

      return isMedia({
        file
      });
    });

    if (validFiles.length !== acceptedFiles.length) {
      setError("Only image and video files are allowed");
    } else {
      setError(null);
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(prev => [...prev, {
          url:  reader.result as string,
          type: file.type.startsWith("image/") ? "image" : "video",
          file
        }]);
      };

      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });

  const removeFile = (index: number) => {
    setPreview(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = {
        ...prev
      };

      delete newProgress[index];

      return newProgress;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (files.length === 0) {
      setError("Please select at least one image or video");
      return;
    }

    try {
      setIsUploading(true);

      if (!user) {
        ToastService.error("User not authenticated");
        throw new Error("User not authenticated");
      }

      const mediaPromises = files.map(async (file, index) => {
        try {
          setUploadProgress(prev => ({
            ...prev,
            [index]: "uploading"
          }));

          const cloudinarySecureUrl = await uploadMedia(file);

          setUploadProgress(prev => ({
            ...prev,
            [index]: "completed"
          }));

          return cloudinarySecureUrl;
        } catch (error) {
          setUploadProgress(prev => ({
            ...prev,
            [index]: "error"
          }));
          throw error;
        }
      });

      const mediaData = await Promise.all(mediaPromises);

      await createPostMutation.mutateAsync({
        user_id: user.id,
        caption,
        media:   mediaData
      });
      ToastService.success("Post created successfully");

      router.push(routes.home);

    } catch {
      ToastService.error("Error creating post");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.target.value);
    setCharCount(e.target.value.length);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8 md:mb-12">Create New Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div className="grid gap-4">
          <Label htmlFor="files">
            Add Photos/Videos
          </Label>
          <div
            {...getRootProps()}
            className="grid place-content-center h-32 border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center cursor-pointer hover:bg-muted-foreground/10"
          >
            <input
              {...getInputProps()}
              accept="image/*,video/*"
            />
            {isDragActive ?
              <p>Drop the files here ...</p> :
              <>
                <p>Click to select photos or videos</p>
                <p className="text-sm text-muted-foreground mt-1">Or drag and drop files here</p>
              </>
            }
          </div>
        </div>

        {preview.length > 0 && (
          <MediaPreview
            preview={preview}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            removeFile={removeFile}
          />
        )}

        <div className="grid gap-4">
          <Label htmlFor="caption">Caption</Label>
          <div className="grid gap-2">
            <Textarea
              id="caption"
              rows={4}
              placeholder="Write a caption..."
              value={caption}
              maxLength={CAPTION_MAX_LENGTH}
              onChange={handleCaptionChange}
            />
            <small className="text-right">{charCount} / {CAPTION_MAX_LENGTH}</small>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="spartan"
            disabled={isUploading}
          >
            {isUploading ? "Creating Post..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
