import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id, username } = await req.json();

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        user_id: id,
        username
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