import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

const pageTitle = "Welcome | Complete Your Profile | Bowel Buddies";
const pageDescription =
  "Set up your poop tracker profile. Choose a unique username to start tracking bowel movements, monitoring gut health, and competing with friends!";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "poop tracker",
    "bowel tracking",
    "gut health",
    "username setup",
    "profile creation",
    "digestive health",
    "health app",
  ],
  alternates: {
    canonical: "https://bowelbuddies.app/onboarding",
  },
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: pageTitle,
    description: pageDescription,
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
    title: pageTitle,
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: pageTitle,
  description: pageDescription,
  url: "https://bowelbuddies.app/onboarding",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  mainEntity: {
    "@type": "WebPageElement",
    name: "Onboarding Form",
    description: "Profile setup form for new Bowel Buddies users",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="min-h-screen bg-background flex items-center justify-center px-6 pt-20">
        <OnboardingForm />
      </div>
    </>
  );
}
