import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Features | Bowel Buddies",
  description:
    "Discover Bowel Buddies features: Bristol Chart tracking, gamification with XP & badges, social features, privacy-first design, and premium capabilities.",
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Features | Bowel Buddies",
    description:
      "Discover Bowel Buddies features: Bristol Chart tracking, gamification with XP & badges, social features, privacy-first design, and premium capabilities.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bowel Buddies Features - Track, Gamify, Connect",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Features | Bowel Buddies",
    description:
      "Discover Bowel Buddies features: Bristol Chart tracking, gamification with XP & badges, social features, privacy-first design, and premium capabilities.",
    images: ["/og-image.png"],
  },
};

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Features | Bowel Buddies",
  description:
    "Discover Bowel Buddies features: Bristol Chart tracking, gamification with XP & badges, social features, privacy-first design, and premium capabilities.",
  url: "https://bowelbuddies.app/features",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Bristol Chart Tracking",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gamification",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Social Features",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Privacy-First",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Premium Capabilities",
      },
    ],
  },
};

const mainFeatures = [
  {
    icon: "monitoring",
    title: "Bristol Chart Tracking",
    description:
      "Log every bowel movement using the medically-recognized Bristol Stool Scale. Track consistency, color, and patterns to understand your gut health.",
    color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
    features: ["7-point Bristol Scale classification", "Photo logging with privacy blur", "Symptom and note tracking", "Pattern recognition over time"],
  },
  {
    icon: "emoji_events",
    title: "Gamification",
    description:
      "Earn XP, unlock badges, and maintain streaks. Turn healthy habits into a fun daily challenge that keeps you motivated.",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
    features: ["XP for every log entry", "Achievement badges (Fiber King, Regular Randy, etc.)", "Daily and weekly streaks", "Level progression system"],
  },
  {
    icon: "groups",
    title: "Social Features",
    description:
      "Connect with friends, join groups, and compete on leaderboards. Share your journey with people who understand.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    features: ["Add friends and share progress", "Create or join private groups", "Global and friends-only leaderboards", "Challenge friends to streaks"],
  },
  {
    icon: "security",
    title: "Privacy-First",
    description:
      "Your data stays yours. Local-first architecture with end-to-end encryption means your sensitive health data is never exposed.",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    features: ["Local-first data storage", "End-to-end encryption", "Granular privacy controls", "No data sold to third parties"],
  },
  {
    icon: "workspace_premium",
    title: "Premium Capabilities",
    description:
      "Unlock advanced analytics, unlimited history, export tools, and exclusive badges with our affordable premium plan.",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
    features: ["Advanced analytics and insights", "Unlimited data history", "PDF/CSV export for doctors", "Premium-only badges and themes"],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <main className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Everything You Need for{" "}
              <span className="text-primary">Better Gut Health</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From tracking your first log to competing with friends on the
              leaderboard, Bowel Buddies makes digestive health monitoring
              engaging, insightful, and fun.
            </p>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mainFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <Icon name={feature.icon} className="text-3xl" />
                  </div>
                  <h2 className="text-xl font-bold font-display mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Icon
                          name="check_circle"
                          className="text-primary flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of users who are taking control of their digestive
              health. It&apos;s free to start, and upgrading unlocks even more
              powerful features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                <Icon name="login" />
                Get Started Free
              </Link>
              <Link
                href="/premium"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-8 py-4 rounded-full font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon name="workspace_premium" />
                View Premium
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
