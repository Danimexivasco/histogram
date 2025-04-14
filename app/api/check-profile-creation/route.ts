import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    if (profileError) {
      return NextResponse.json({
        error: profileError
      }, {
        status: 500
      });
    }

    return NextResponse.json({
      exists: true
    });

  } catch {
    return NextResponse.json({
      error: "Something went wrong checking the profile"
    }, {
      status: 500
    });
  }
}