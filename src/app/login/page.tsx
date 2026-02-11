import { Metadata } from "next";
import LoginForm from "./LoginForm";

const pageDescription = "Sign in to your poop tracker app. Track bowel movements, monitor gut health using the Bristol Stool Scale, and join friends on your wellness journey today!";

export const metadata: Metadata = {
  title: "Poop Tracker App | Sign In - Bowel Buddies",
  description: pageDescription,
  openGraph: {
    title: "Poop Tracker App | Sign In - Bowel Buddies",
    description: pageDescription,
    type: "website",
    url: "https://bowelbuddies.app/login",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bowel Buddies - Track Your Gut Health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Poop Tracker App | Sign In - Bowel Buddies",
    description: pageDescription,
    images: ["/og-image.png"],
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
