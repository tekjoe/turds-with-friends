import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "The Complete Bristol Stool Chart Guide | Bowel Buddies",
  description:
    "Learn everything about the Bristol Stool Scale: what each of the 7 types means, when to see a doctor, and how to track your bowel health effectively.",
  keywords: [
    "bristol stool chart",
    "bristol stool scale",
    "stool types",
    "poop chart",
    "bowel movement types",
    "digestive health",
  ],
  openGraph: {
    title: "The Complete Bristol Stool Chart Guide",
    description:
      "Learn everything about the Bristol Stool Scale: what each of the 7 types means and how to track your bowel health.",
    type: "article",
    publishedTime: "2026-02-14T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Complete Bristol Stool Chart Guide",
    description:
      "Learn everything about the Bristol Stool Scale: what each of the 7 types means and how to track your bowel health.",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "The Complete Bristol Stool Chart Guide",
  description:
    "Everything you need to know about the Bristol Stool Scale: what each type means, when to worry, and how to use it to track your digestive health.",
  datePublished: "2026-02-14T00:00:00Z",
  dateModified: "2026-02-14T00:00:00Z",
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
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://bowelbuddies.app/blog/bristol-stool-chart-guide",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Bristol Stool Chart?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bristol Stool Chart (also called the Bristol Stool Scale or Bristol Stool Form Scale) is a medical diagnostic tool designed to classify human stool into seven categories. It was developed at the Bristol Royal Infirmary in 1997 by Dr. Ken Heaton and Dr. Stephen Lewis.",
      },
    },
    {
      "@type": "Question",
      name: "What is the ideal stool type?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Types 3 and 4 are generally considered ideal. Type 3 is sausage-shaped with cracks on the surface, and Type 4 is smooth and soft like a sausage or snake. Both indicate a healthy digestive system with adequate fiber and hydration.",
      },
    },
    {
      "@type": "Question",
      name: "How often should you poop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most doctors consider anywhere from 3 times a day to 3 times a week as normal. The key is consistency - a sudden change in your pattern is more concerning than the frequency itself.",
      },
    },
    {
      "@type": "Question",
      name: "When should I see a doctor about my stool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "See a doctor if you consistently experience Type 1 or Type 7 stools, notice blood in your stool, have sudden unexplained changes in bowel habits lasting more than two weeks, or experience persistent abdominal pain.",
      },
    },
  ],
};

const stoolTypes = [
  {
    type: 1,
    name: "Separate hard lumps",
    description: "Small, hard, separate lumps that look like nuts or rabbit droppings. They can be difficult to pass.",
    meaning: "Indicates severe constipation. Stool has spent too long in the colon, and too much water has been absorbed.",
    color: "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    status: "Constipated",
  },
  {
    type: 2,
    name: "Lumpy and sausage-shaped",
    description: "Sausage-shaped but lumpy and hard. Often uncomfortable to pass.",
    meaning: "Mild constipation. Could benefit from more fiber and water.",
    color: "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    status: "Slightly Constipated",
  },
  {
    type: 3,
    name: "Sausage with cracks",
    description: "Like a sausage but with cracks on the surface. Easy to pass.",
    meaning: "Normal, healthy stool. Good fiber intake and hydration.",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    status: "Ideal",
  },
  {
    type: 4,
    name: "Smooth, soft sausage",
    description: "Like a smooth, soft sausage or snake. Very easy to pass.",
    meaning: "The gold standard. Indicates optimal digestive health.",
    color: "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    status: "Ideal",
  },
  {
    type: 5,
    name: "Soft blobs with clear edges",
    description: "Soft blobs with clear-cut edges. Passed easily.",
    meaning: "Slightly loose. May indicate insufficient fiber in the diet.",
    color: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    status: "Lacking Fiber",
  },
  {
    type: 6,
    name: "Mushy with ragged edges",
    description: "Fluffy pieces with ragged edges. Mushy consistency.",
    meaning: "Mild diarrhea. May indicate inflammation or food sensitivity.",
    color: "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    status: "Inflammation",
  },
  {
    type: 7,
    name: "Entirely liquid",
    description: "Watery with no solid pieces. Entirely liquid.",
    meaning: "Severe diarrhea. Often indicates infection, food poisoning, or illness. Seek medical attention if persistent.",
    color: "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    status: "Diarrhea",
  },
];

export default function BristolStoolChartGuide() {
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
              <span className="text-xs text-slate-500">8 min read</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100 leading-tight">
              The Complete Bristol Stool Chart Guide
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              The Bristol Stool Chart is the medical gold standard for classifying your bowel
              movements. Whether you&apos;re tracking for health reasons or just curious about
              what&apos;s normal, this guide covers everything you need to know.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="px-6 pb-24">
          <div className="max-w-3xl mx-auto prose-slate dark:prose-invert">
            {/* What is it? */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                What is the Bristol Stool Chart?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                The Bristol Stool Chart (also called the Bristol Stool Scale or Bristol Stool
                Form Scale) is a medical diagnostic tool designed to classify human stool into
                seven categories. It was developed at the Bristol Royal Infirmary in 1997 by
                Dr. Ken Heaton and Dr. Stephen Lewis.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Doctors and patients use it worldwide to describe stool consistency in a
                standardized way, making it easier to communicate about digestive health
                without awkwardness.
              </p>
            </section>

            {/* The 7 Types */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100">
                The 7 Types Explained
              </h2>

              <div className="space-y-4">
                {stoolTypes.map((stool) => (
                  <div
                    key={stool.type}
                    className={`${stool.color} border rounded-2xl p-6`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-bold text-xl ${stool.textColor}`}>
                        {stool.type}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                            Type {stool.type}: {stool.name}
                          </h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stool.textColor} bg-white/50 dark:bg-slate-900/50`}>
                            {stool.status}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                          {stool.description}
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                          What it means: {stool.meaning}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* When to See a Doctor */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                When to See a Doctor
              </h2>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  While occasional changes in stool are normal, consult a healthcare
                  professional if you experience:
                </p>
                <ul className="space-y-2">
                  {[
                    "Consistently Type 1 or Type 7 stools for more than a few days",
                    "Blood in your stool (red or black/tarry)",
                    "Sudden, unexplained changes lasting more than two weeks",
                    "Persistent abdominal pain or cramping",
                    "Unintended weight loss alongside changes in bowel habits",
                    "Mucus in your stool",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Icon name="warning" className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                Tips for Healthier Bowel Movements
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: "local_drink",
                    title: "Stay Hydrated",
                    text: "Drink 6-8 glasses of water daily. Dehydration is one of the most common causes of constipation.",
                  },
                  {
                    icon: "nutrition",
                    title: "Eat Enough Fiber",
                    text: "Aim for 25-30g of fiber daily from fruits, vegetables, whole grains, and legumes.",
                  },
                  {
                    icon: "directions_run",
                    title: "Exercise Regularly",
                    text: "Physical activity stimulates intestinal activity and helps maintain regular bowel movements.",
                  },
                  {
                    icon: "self_improvement",
                    title: "Manage Stress",
                    text: "The gut-brain connection is real. Chronic stress can significantly affect digestive health.",
                  },
                ].map((tip) => (
                  <div
                    key={tip.title}
                    className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5"
                  >
                    <Icon name={tip.icon} className="text-2xl text-primary mb-2" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-3xl p-8 text-center">
              <h2 className="text-2xl font-bold font-display mb-3 text-slate-800 dark:text-slate-100">
                Start Tracking Your Gut Health
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Use Bowel Buddies to log your Bristol type daily. Spot patterns,
                build healthy streaks, and even compete with friends.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-8 rounded-full transition-colors"
              >
                Get Started Free
              </Link>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
