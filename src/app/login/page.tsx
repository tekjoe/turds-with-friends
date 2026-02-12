import { Metadata } from "next";
import LoginForm from "./LoginForm";

const pageDescription = "Sign in to your poop tracker app. Track bowel movements, monitor gut health using the Bristol Stool Scale, and join friends on your wellness journey today!";

export const metadata: Metadata = {
  title: "Poop Tracker App | Sign In - Bowel Buddies",
  description: pageDescription,
  keywords: [
    "poop tracker app",
    "bowel tracking",
    "sign in",
    "login",
    "gut health",
    "bristol stool chart",
    "digestive health",
    "health app",
  ],
  alternates: {
    canonical: "https://bowelbuddies.app/login",
  },
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

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Poop Tracker App | Sign In - Bowel Buddies",
  description: pageDescription,
  url: "https://bowelbuddies.app/login",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  mainEntity: {
    "@type": "WebPageElement",
    name: "Login Form",
    description: "User authentication form for Bowel Buddies",
  },
};

export default function LoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <LoginForm />
    </>
  );
}
