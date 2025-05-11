import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { post_id } = await req.json();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    const { data: newLike, error: likeError } = await supabase.from("likes").insert({
      user_id: user.id,
      post_id: post_id
    });

    if (likeError) {
      return NextResponse.json({
        error: "Error liking post"
      }, {
        status: 500
      });
    }

    const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", post_id)
      .single();

    if (post && post.user_id !== user.id) {
      await supabase.from("notifications").insert({
        type:         "like",
        from_user_id: user.id,
        to_user_id:   post.user_id,
        post_id:      post_id
      });
    }

    return NextResponse.json({
      newLike
    });
  } catch {
    return NextResponse.json({
      error: "Something went wrong liking the post"
    }, {
      status: 500
    });
  }

}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { post_id } = await req.json();

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      });
    }

    const { error: deleteLikeError } = await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post_id);

    if (deleteLikeError) {
      return NextResponse.json({
        error: "Error unliking post"
      }, {
        status: 500
      });
    }

    return NextResponse.json({
      post_id
    });
  } catch {
    return NextResponse.json({
      error: "Something went wrong unliking the post"
    }, {
      status: 500
    });
  }

}
