import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({
      error: "No id provided"
    }, {
      status: 400
    });
  }
  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
      id
    );

    if (error) {
      return NextResponse.json({
        error: "Something went wrong deleting the user"
      }, {
        status: 500
      });
    }
    const { user } = data;

    return NextResponse.json({
      id: user.id
    });
  } catch {
    return NextResponse.json({
      error: "Unexpected error deleting the user"
    }, {
      status: 500
    }
    );
  }
}