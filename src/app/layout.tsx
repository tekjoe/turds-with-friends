import type { Metadata, Viewport } from "next";
import { Outfit, Quicksand } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

// WebSite structured data (JSON-LD)
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bowel Buddies",
  url: "https://bowelbuddies.app",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://bowelbuddies.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bowelbuddies.app"),
  title: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
  description:
    "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
  keywords: ["poop tracker app", "bowel tracking", "bristol stool chart", "gut health", "digestive health"],
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
    description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bowel Buddies - Poop Tracker App for Gut Health",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
    description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userName: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    userName = profile?.display_name ?? user.email?.split("@")[0] ?? "User";
  }

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const premium = user ? await isPremium(user.id) : false;

  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${quicksand.variable} antialiased bg-[#FDFBF7] dark:bg-[#1A1614] text-slate-800 dark:text-slate-200 min-h-screen w-full`}
      >
        <Navbar isAuthenticated={!!user} userName={userName} avatarUrl={avatarUrl} isPremium={premium} />
        {children}
      </body>
    </html>
  );
}
