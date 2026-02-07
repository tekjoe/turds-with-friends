import type { Metadata, Viewport } from "next";
import { Outfit, Quicksand } from "next/font/google";
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
  title: "Turds with Friends | Gamified Bowel Tracking",
  description:
    "Track your digestive health with the Bristol Stool Chart. Compete with friends, earn badges, and maintain a healthy gut together.",
  keywords: ["bowel tracking", "bristol stool chart", "gut health", "digestive health"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} ${quicksand.variable} antialiased bg-[#FDFBF7] dark:bg-[#1A1614] text-slate-800 dark:text-slate-200 min-h-screen w-full`}
      >
        {children}
      </body>
    </html>
  );
}
