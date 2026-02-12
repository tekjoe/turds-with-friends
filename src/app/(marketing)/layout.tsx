import type { Metadata } from "next";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: {
    default: "Bowel Buddies | Gamified Bowel Tracking",
    template: "%s | Bowel Buddies",
  },
  description:
    "Track your digestive health with the Bristol Stool Chart. Compete with friends, earn badges, and maintain a healthy gut together.",
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
