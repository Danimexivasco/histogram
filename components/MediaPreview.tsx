import { isImage } from "@/lib/utils/mediaCheck";
import Image from "next/image";
import { Button } from "./ui/Button";
import { CheckIcon, XIcon } from "lucide-react";
import { FilePreview, UploadProgress } from "@/app/[username]/post/create/page";

type MediaPreviewProps = {
  preview: FilePreview[];
  uploadProgress: UploadProgress;
  isUploading: boolean;
  removeFile: (_index: number) => void;
};

export default function MediaPreview({
  preview,
  uploadProgress,
  isUploading,
  removeFile
}: MediaPreviewProps) {
  return (
    <section>
      <p className="text-lg font-medium mb-2">Preview</p>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(10rem,_1fr))] gap-6">
        {preview.map((item, index) => (
          <div
            key={index}
            className="relative shadow"
          >
            {isImage({
              file: item.file
            }) ? (
                <Image
                  src={item.url}
                  alt={`Preview ${index}`}
                  className="h-64 w-full object-cover rounded"
                  width={175}
                  height={256}
                />
              ) : (
                <video
                  src={item.url}
                  className="h-64 w-full object-contain rounded"
                  controls
                />
              )}
            {uploadProgress[index] && (
              <div
                className={`absolute inset-0 bg-black/50 flex items-center justify-center rounded ${
                  uploadProgress[index] === "completed"
                    ? "bg-green-500/70"
                    : uploadProgress[index] === "error"
                      ? "bg-red-500/70"
                      : ""
                }`}
              >
                {uploadProgress[index] === "uploading" && (
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {uploadProgress[index] === "completed" && (
                  <div className="text-white"><CheckIcon size={32}/></div>
                )}
                {uploadProgress[index] === "error" && (
                  <div className="text-white"><XIcon size={32}/></div>
                )}
              </div>
            )}
            {!isUploading &&
              <Button
                type="button"
                variant="destructive"
                className="absolute top-0.5 right-0.5 -translate-y-1/2 translate-x-1/2 !bg-red-600 rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-background"
                aria-label="Remove file"
                onClick={() => removeFile(index)}
              >
                <XIcon size={20}/>
              </Button>
            }
          </div>
        ))}
      </div>
    </section>
  );
}