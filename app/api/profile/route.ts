import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, username, email, fullname, avatar_url } = await req.json();

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: id,
        username,
        email,
        fullname,
        avatar_url
      }]);

    if (profileError) {
      return NextResponse.json({
        error: profileError
      }, {
        status: 500
      });
    }

    return NextResponse.json({
      id
    });

  } catch {
    return NextResponse.json({
      error: "Something went wrong creating the profile"
    }, {
      status: 500
    });
  }
}