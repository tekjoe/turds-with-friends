import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dashboard | Bowel Buddies",
    description: "Track your digestive health with the Bristol Stool Chart. View your streaks, analytics, and compete with friends.",
    url: "https://bowelbuddies.app",
    isPartOf: {
      "@type": "WebSite",
      name: "Bowel Buddies",
      url: "https://bowelbuddies.app",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      {children}
    </>
  );
}
