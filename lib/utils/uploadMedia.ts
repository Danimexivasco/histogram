import { apiRoutes } from "../apiRoutes";
import { isMedia } from "./mediaCheck";

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export const uploadMedia = async (file: File) => {
  try {
    if (!isMedia({
      file
    })) {
      throw new Error("Invalid file type. Only image or video files are allowed.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const base64File = await convertToBase64(file as File);

    const response = await fetch(apiRoutes.cloudinary, {
      method: "POST",
      body:   JSON.stringify({
        file: base64File
      })
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }

    const { secure_url }: { secure_url: string } = await response.json();

    return secure_url;

  } catch {
    throw new Error("Error uploading media");
  }
};