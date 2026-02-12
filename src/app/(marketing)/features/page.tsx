import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Features",
  description: "Discover Bowel Buddies' powerful features: bowel tracking, gamification, social features, and privacy-first design. Track your digestive health with friends.",
  openGraph: {
    title: "Features | Bowel Buddies",
    description: "Discover Bowel Buddies' powerful features: bowel tracking, gamification, social features, and privacy-first design.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Features | Bowel Buddies",
    description: "Discover Bowel Buddies' powerful features: bowel tracking, gamification, social features, and privacy-first design.",
  },
};

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Features | Bowel Buddies",
  description: "Discover Bowel Buddies' powerful features: bowel tracking, gamification, social features, and privacy-first design. Track your digestive health with friends.",
  url: "https://bowelbuddies.app/features",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
};

const featureSections = [
  {
    icon: "track_changes",
    title: "Smart Bowel Tracking",
    description: "Log your bowel movements with the Bristol Stool Chart. Track frequency, consistency, and patterns over time to understand your digestive health better.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: "emoji_events",
    title: "Gamification & Rewards",
    description: "Earn XP, unlock badges like 'Fiber King' and 'Streak Master', and climb the leaderboards. Stay motivated with daily challenges and achievements.",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
  },
  {
    icon: "groups",
    title: "Social Features",
    description: "Create private groups with friends, family, or colleagues. Share progress, compete on leaderboards, and support each other's health journey together.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  },
  {
    icon: "lock",
    title: "Privacy First",
    description: "Your data is encrypted and secure. Control your privacy settings, choose what to share, and rest easy knowing your health data stays private.",
    color: "bg-accent/10 text-accent",
  },
];

const additionalFeatures = [
  {
    title: "Daily Reminders",
    description: "Never miss a log with customizable notifications and reminders.",
  },
  {
    title: "Health Insights",
    description: "Get personalized insights and trends based on your tracking data.",
  },
  {
    title: "Doctor Reports",
    description: "Generate monthly health reports to share with your healthcare provider.",
  },
  {
    title: "Fiber Tracking",
    description: "Log your daily fiber intake and see how it affects your digestion.",
  },
  {
    title: "Hydration Monitor",
    description: "Track water intake alongside your bowel movements for complete gut health.",
  },
  {
    title: "Streak Tracking",
    description: "Build healthy habits with daily streaks and consistency rewards.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="w-full">
        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pt-36 md:pb-24 px-6 bg-[#FDFBF7] dark:bg-[#1A1614]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100">
              Everything You Need for{" "}
              <span className="text-primary">Better Gut Health</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Bowel Buddies combines powerful tracking tools with social motivation
              to help you maintain a healthy digestive system.
            </p>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {featureSections.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-[#FDFBF7] dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col"
                >
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-6`}
                  >
                    <Icon name={feature.icon} className="text-3xl" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                    {feature.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-16 px-6 bg-[#FDFBF7] dark:bg-[#1A1614]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12 text-slate-800 dark:text-slate-100">
              More Great Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-white dark:bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Join thousands of users who are already tracking their gut health
              and building better habits together.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-full transition-colors"
            >
              Start Tracking Free
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
