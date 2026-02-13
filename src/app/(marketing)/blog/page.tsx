import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Blog | Gut Health Tips & Guides",
  description:
    "Expert articles on gut health, bowel tracking, the Bristol Stool Chart, and digestive wellness. Science-backed guides to improve your digestive health.",
  openGraph: {
    title: "Blog | Bowel Buddies",
    description:
      "Expert articles on gut health, bowel tracking, the Bristol Stool Chart, and digestive wellness.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Bowel Buddies",
    description:
      "Expert articles on gut health, bowel tracking, the Bristol Stool Chart, and digestive wellness.",
  },
};

const blogPageSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Bowel Buddies Blog",
  description:
    "Expert articles on gut health, bowel tracking, the Bristol Stool Chart, and digestive wellness.",
  url: "https://bowelbuddies.app/blog",
  publisher: {
    "@type": "Organization",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  featured?: boolean;
}

const posts: BlogPost[] = [
  {
    slug: "bristol-stool-chart-guide",
    title: "The Complete Bristol Stool Chart Guide",
    description:
      "Everything you need to know about the Bristol Stool Scale: what each type means, when to worry, and how to use it to track your digestive health.",
    category: "Health Guide",
    readTime: "8 min read",
    date: "2026-02-14",
    featured: true,
  },
  {
    slug: "how-often-should-you-poop",
    title: "How Often Should You Poop? A Science-Based Guide",
    description:
      "What's normal when it comes to bowel movement frequency? We break down the science of healthy pooping habits.",
    category: "Health Guide",
    readTime: "6 min read",
    date: "2026-02-14",
  },
  {
    slug: "gamified-health-tracking",
    title: "Gamified Health Tracking: Why It Works",
    description:
      "The psychology behind gamification in health apps. How XP, streaks, and social features help you build better habits.",
    category: "Wellness",
    readTime: "5 min read",
    date: "2026-02-14",
  },
];

export default function BlogIndex() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPageSchema) }}
      />

      <div className="w-full">
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-36 md:pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 text-slate-800 dark:text-slate-100">
              The Bowel Buddies <span className="text-primary">Blog</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Science-backed guides, gut health tips, and the occasional poop joke.
              Everything you need to know about your digestive health.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="px-6 pb-12">
            <div className="max-w-4xl mx-auto">
              <Link
                href={`/blog/${featured.slug}`}
                className="block bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-3xl p-8 md:p-12 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Featured
                  </span>
                  <span className="text-xs text-slate-500">{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                  {featured.description}
                </p>
                <span className="inline-flex items-center gap-1 text-primary font-semibold">
                  Read article
                  <Icon name="arrow_forward" className="text-lg group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </section>
        )}

        {/* Post Grid */}
        <section className="px-6 pb-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
