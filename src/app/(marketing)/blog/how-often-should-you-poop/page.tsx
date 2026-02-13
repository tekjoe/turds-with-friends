import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "How Often Should You Poop? A Science-Based Guide | Bowel Buddies",
  description:
    "What's a normal bowel movement frequency? Learn the science behind healthy pooping habits, what affects regularity, and when to talk to your doctor.",
  keywords: [
    "how often should you poop",
    "normal bowel movement frequency",
    "healthy pooping habits",
    "bowel regularity",
  ],
  openGraph: {
    title: "How Often Should You Poop? A Science-Based Guide",
    description:
      "What's a normal bowel movement frequency? Learn the science behind healthy pooping habits.",
    type: "article",
    publishedTime: "2026-02-14T00:00:00Z",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Often Should You Poop? A Science-Based Guide",
  description:
    "What's a normal bowel movement frequency? Learn the science behind healthy pooping habits, what affects regularity, and when to talk to your doctor.",
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How often should you poop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most gastroenterologists consider anywhere from 3 times per day to 3 times per week as the normal range. What matters most is consistency in your personal pattern rather than hitting an exact number.",
      },
    },
    {
      "@type": "Question",
      name: "Is it normal to poop every day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, pooping once a day is common and considered normal. However, some healthy people go more or less frequently. The key indicator of health is the consistency and ease of your bowel movements, not just frequency.",
      },
    },
    {
      "@type": "Question",
      name: "What causes irregular bowel movements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common causes include insufficient fiber intake, dehydration, lack of exercise, stress, travel, medication side effects, and changes in diet. Persistent irregularity should be discussed with a healthcare provider.",
      },
    },
  ],
};

export default function HowOftenShouldYouPoop() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
                Health Guide
              </span>
              <span className="text-xs text-slate-500">6 min read</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100 leading-tight">
              How Often Should You Poop? A Science-Based Guide
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              It&apos;s a question most people are too embarrassed to ask their doctor.
              Let&apos;s break down what science actually says about bowel movement frequency.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            {/* The Normal Range */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                The &quot;Normal&quot; Range
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Most gastroenterologists agree: anywhere from <strong>3 times per day to 3
                times per week</strong> is considered normal. That&apos;s a wide range, and for
                good reason -- everyone&apos;s digestive system is different.
              </p>

              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-4">
                <p className="text-green-800 dark:text-green-200 font-semibold mb-2">
                  Key Takeaway
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  What matters most isn&apos;t how often you go, but whether your pattern is
                  consistent and your stools are Bristol Type 3 or 4 (smooth and easy to pass).
                  A sudden change in your pattern is more significant than the frequency itself.
                </p>
              </div>
            </section>

            {/* What Affects Frequency */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                What Affects Bowel Movement Frequency?
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Diet & Fiber Intake",
                    text: "A high-fiber diet (25-30g daily) promotes more regular bowel movements. Fiber adds bulk to stool and helps it move through your digestive tract more efficiently.",
                    icon: "nutrition",
                  },
                  {
                    title: "Hydration",
                    text: "Water is essential for healthy digestion. Dehydration makes stool harder and more difficult to pass, leading to less frequent bowel movements.",
                    icon: "local_drink",
                  },
                  {
                    title: "Physical Activity",
                    text: "Exercise stimulates intestinal contractions (peristalsis). Even a daily 30-minute walk can significantly improve regularity.",
                    icon: "directions_run",
                  },
                  {
                    title: "Stress & Sleep",
                    text: "Your gut has its own nervous system (the enteric nervous system) that responds to stress. Poor sleep and chronic stress can disrupt your regular pattern.",
                    icon: "self_improvement",
                  },
                  {
                    title: "Medications",
                    text: "Many common medications affect bowel frequency. Pain relievers (especially opioids), antacids, blood pressure medications, and antidepressants can all cause changes.",
                    icon: "medication",
                  },
                  {
                    title: "Age & Hormones",
                    text: "Bowel habits naturally change with age. Hormonal fluctuations during menstrual cycles, pregnancy, and menopause also affect frequency.",
                    icon: "person",
                  },
                ].map((factor) => (
                  <div
                    key={factor.title}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 flex gap-4"
                  >
                    <Icon name={factor.icon} className="text-2xl text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {factor.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {factor.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Track */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                Why Tracking Matters
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Most people have no idea what their &quot;normal&quot; is because they&apos;ve never tracked
                it. Without a baseline, it&apos;s impossible to notice meaningful changes that might
                indicate a health issue.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                By logging your bowel movements for just a few weeks, you&apos;ll establish your
                personal baseline. This data is incredibly valuable if you ever need to discuss
                digestive concerns with your doctor.
              </p>
            </section>

            {/* When to Worry */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                When to See a Doctor
              </h2>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <ul className="space-y-2">
                  {[
                    "You haven't had a bowel movement in more than 3 days",
                    "You're going significantly more than 3 times a day",
                    "There's been a sudden, unexplained change lasting 2+ weeks",
                    "You see blood in your stool",
                    "You experience severe pain during bowel movements",
                    "You have unexplained weight loss alongside changes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Icon name="warning" className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-bold font-display mb-3 text-slate-800 dark:text-slate-100">
                Know Your Normal
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Track your bowel movements with Bowel Buddies to establish your personal
                baseline. It takes 30 seconds a day and could change how you understand
                your health.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Start Tracking Free
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
