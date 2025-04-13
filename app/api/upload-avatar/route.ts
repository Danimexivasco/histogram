import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const user_id = formData.get("user_id") as string;
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({
    error: "No file provided"
  }, {
    status: 400
  });

  try {
    const fileExt = file.name?.split(".").pop();
    const fileName = `${user_id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, new Uint8Array(fileBuffer), {
        contentType: file.type
      });

    if (uploadError) throw uploadError;

    const { data } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return NextResponse.json({
      avatarUrl: data.publicUrl
    });
  } catch {
    return NextResponse.json({
      error: "Something went wrong uploading avatar"
    }, {
      status: 500
    });
  }

}