import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

interface RouteConfig {
  name: string;
  description: string;
}

const routeMap: Record<string, RouteConfig> = {
  "/dashboard": {
    name: "Dashboard | Bowel Buddies",
    description: "View your digestive health dashboard, streaks, weight trends, and friend rankings.",
  },
  "/log": {
    name: "Log Movement | Bowel Buddies",
    description: "Record your bowel movement using the Bristol Stool Chart. Track type, time, and location.",
  },
  "/analytics": {
    name: "Analytics | Bowel Buddies",
    description: "View detailed analytics of your digestive health including monthly trends, time of day patterns, and Bristol type distribution.",
  },
  "/map": {
    name: "Poop Map | Bowel Buddies",
    description: "Explore your poop locations on an interactive map. See where you've gone and discover patterns.",
  },
  "/friends": {
    name: "Friends | Bowel Buddies",
    description: "Connect with friends, view their activity, and share your digestive health journey.",
  },
  "/challenges": {
    name: "Challenges | Bowel Buddies",
    description: "Participate in digestive health challenges, earn XP, and compete with friends.",
  },
  "/leaderboard": {
    name: "Leaderboard | Bowel Buddies",
    description: "See how you rank against friends on the Bowel Buddies leaderboard. Compete for the top spot!",
  },
  "/activity": {
    name: "Activity | Bowel Buddies",
    description: "View your recent activity, friend requests, and comments on your bowel movements.",
  },
  "/upgrade": {
    name: "Upgrade | Bowel Buddies",
    description: "Upgrade to Bowel Buddies Premium for advanced analytics, unlimited history, and more features.",
  },
  "/settings": {
    name: "Settings | Bowel Buddies",
    description: "Manage your Bowel Buddies account settings, profile information, and preferences.",
  },
  "/settings/privacy": {
    name: "Privacy Settings | Bowel Buddies",
    description: "Control your privacy settings. Choose what information to share with friends and on the leaderboard.",
  },
};

function getRouteConfig(pathname: string): RouteConfig {
  // Exact match first
  if (routeMap[pathname]) {
    return routeMap[pathname];
  }
  
  // Fallback to parent route for nested paths not explicitly mapped
  for (const route of Object.keys(routeMap).sort((a, b) => b.length - a.length)) {
    if (pathname.startsWith(route + "/")) {
      return routeMap[route];
    }
  }
  
  // Default fallback
  return {
    name: "Dashboard | Bowel Buddies",
    description: "Track your digestive health with the Bristol Stool Chart. View your streaks, analytics, and compete with friends.",
  };
}

export default async function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("x-matched-path") || "/dashboard";
  
  const config = getRouteConfig(pathname);
  const canonicalUrl = `https://bowelbuddies.app${pathname}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.name,
    description: config.description,
    url: canonicalUrl,
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
