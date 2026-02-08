import type { Metadata, Viewport } from "next";
import { Outfit, Quicksand } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { isPremium } from "@/lib/premium";
import { Navbar } from "@/components/ui/Navbar";
import "./globals.css";

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
  title: "Bowel Buddies | Gamified Bowel Tracking",
  description:
    "Track your digestive health with the Bristol Stool Chart. Compete with friends, earn badges, and maintain a healthy gut together.",
  keywords: ["bowel tracking", "bristol stool chart", "gut health", "digestive health"],
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
          rel="stylesheet"
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
