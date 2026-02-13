import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Gamified Health Tracking: Why It Works | Bowel Buddies",
  description:
    "Discover the psychology behind gamified health apps. Learn how XP, streaks, badges, and social features drive lasting habit change.",
  keywords: [
    "gamified health app",
    "health gamification",
    "habit tracking",
    "streak motivation",
    "health tracking app",
  ],
  openGraph: {
    title: "Gamified Health Tracking: Why It Works",
    description:
      "The psychology behind gamification in health apps. How XP, streaks, and social features help you build better habits.",
    type: "article",
    publishedTime: "2026-02-14T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gamified Health Tracking: Why It Works",
  description:
    "Discover the psychology behind gamified health apps. Learn how XP, streaks, badges, and social features drive lasting habit change.",
  datePublished: "2026-02-14T00:00:00Z",
  author: {
    "@type": "Organization",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  publisher: {
    "@type": "Organization",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
};

export default function GamifiedHealthTracking() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="w-full">
        {/* Hero */}
        <header className="pt-32 pb-12 md:pt-36 md:pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
            >
              <Icon name="arrow_back" className="text-lg" />
              Back to blog
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Wellness
              </span>
              <span className="text-xs text-slate-500">5 min read</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100 leading-tight">
              Gamified Health Tracking: Why It Works
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Why does Duolingo keep you coming back? Why is your Apple Watch streak
              so hard to break? The psychology behind gamification reveals powerful
              principles for health behavior change.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            {/* The Problem */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                The Health Tracking Drop-Off Problem
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Most health tracking apps have an 80% drop-off rate within the first two
                weeks. Users start with motivation, but without ongoing engagement mechanisms,
                they stop logging. The data becomes useless.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Gamification solves this by tapping into fundamental human psychology:
                our love of progress, competition, and social validation.
              </p>
            </section>

            {/* The Mechanisms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                The Four Pillars of Health Gamification
              </h2>

              <div className="space-y-6">
                {[
                  {
                    number: "01",
                    title: "Progress Visualization (XP & Levels)",
                    description:
                      "Humans are wired to seek progress. When you see XP accumulating and your level increasing, your brain releases dopamine -- the same reward chemical triggered by completing any goal. In Bowel Buddies, every log earns 50 XP, and each level (earned every 500 XP) comes with a unique title, from 'Bowel Beginner' to 'Legendary Bowel Master.'",
                    principle: "Variable Ratio Reinforcement",
                  },
                  {
                    number: "02",
                    title: "Loss Aversion (Streaks)",
                    description:
                      "Once you've built a 14-day streak, the fear of losing it becomes a stronger motivator than the desire to extend it. This is loss aversion -- a well-documented cognitive bias where people feel losses roughly twice as strongly as equivalent gains. Streaks exploit this beautifully for habit formation.",
                    principle: "Loss Aversion (Kahneman & Tversky)",
                  },
                  {
                    number: "03",
                    title: "Achievement Milestones (Badges)",
                    description:
                      "Badges serve as milestone markers on a longer journey. They break an infinite task ('track your health forever') into concrete, achievable goals ('log 7 days in a row'). Each badge earned creates a moment of celebration and a shareable achievement.",
                    principle: "Goal-Gradient Effect",
                  },
                  {
                    number: "04",
                    title: "Social Accountability (Leaderboards & Friends)",
                    description:
                      "We're social creatures. Knowing that your friends can see your streak creates gentle accountability. Leaderboards add competitive motivation for those who thrive on it. Research shows that social support is one of the strongest predictors of sustained behavior change.",
                    principle: "Social Facilitation Theory",
                  },
                ].map((pillar) => (
                  <div
                    key={pillar.number}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl font-bold text-primary/30 font-display">
                        {pillar.number}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2">
                          {pillar.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                          {pillar.description}
                        </p>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {pillar.principle}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* The Evidence */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                Does It Actually Work?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                A 2023 meta-analysis published in the Journal of Medical Internet Research
                found that gamified health interventions showed a <strong>48% improvement
                in adherence</strong> compared to non-gamified alternatives. The effects were
                most pronounced when gamification included social elements.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { stat: "48%", label: "Better adherence with gamification" },
                  { stat: "2.3x", label: "More likely to maintain 30-day streaks" },
                  { stat: "67%", label: "Higher engagement with social features" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center"
                  >
                    <p className="text-3xl font-bold text-primary mb-1">{item.stat}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-bold font-display mb-3 text-slate-800 dark:text-slate-100">
                Experience It Yourself
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Bowel Buddies combines all four pillars of health gamification.
                Track your gut health, earn XP, compete with friends, and actually
                stick with it.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Start Your Streak
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
