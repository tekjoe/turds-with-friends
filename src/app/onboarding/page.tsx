import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata: Metadata = {
  title: "Welcome | Complete Your Profile | Bowel Buddies",
  description:
    "Set up your poop tracker profile. Choose a unique username to start tracking bowel movements, monitoring gut health, and competing with friends!",
  keywords: [
    "poop tracker",
    "bowel tracking",
    "gut health",
    "username setup",
    "profile creation",
    "digestive health",
    "health app",
  ],
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Welcome | Complete Your Profile | Bowel Buddies",
    description:
      "Set up your poop tracker profile. Choose a unique username to start tracking bowel movements, monitoring gut health, and competing with friends!",
    url: "https://bowelbuddies.app/onboarding",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bowel Buddies - Complete Your Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Welcome | Complete Your Profile | Bowel Buddies",
    description:
      "Set up your poop tracker profile. Choose a unique username to start tracking bowel movements, monitoring gut health, and competing with friends!",
    images: ["/og-image.png"],
  },
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  if (profile?.username) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 pt-20">
      <OnboardingForm />
    </div>
  );
}
