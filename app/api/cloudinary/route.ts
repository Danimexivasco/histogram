import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json();

    if (!file) {
      return NextResponse.json(
        {
          error: "File is required"
        },
        {
          status: 400
        });
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = `timestamp=${timestamp}&upload_preset=${process.env.CLOUDINARY_UPLOAD_PRESET}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      signature,
      api_key:       process.env.CLOUDINARY_API_KEY
    });

    return NextResponse.json({
      secure_url: uploadResponse.secure_url
    }, {
      status: 200
    });

  } catch {
    return NextResponse.json({
      error: "Image upload failed"
    }, {
      status: 500
    });
  }
}
