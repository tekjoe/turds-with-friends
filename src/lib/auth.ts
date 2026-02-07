import { createClient } from "@/lib/supabase/client";

export type OAuthProvider = "google" | "apple";

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: provider === "google" ? {
        access_type: "offline",
        prompt: "consent",
      } : undefined,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

export async function getSession() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}
