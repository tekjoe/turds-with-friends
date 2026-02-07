import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Accept a friend request
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { friendship_id } = await request.json();

  const { error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendship_id)
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// Decline a friend request
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { friendship_id } = await request.json();

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendship_id)
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
