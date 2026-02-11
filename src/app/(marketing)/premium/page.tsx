import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Premium | Bowel Buddies",
  description:
    "Upgrade to Bowel Buddies Premium for $4.99/mo or $39.99/yr. Unlock advanced analytics, unlimited history, PDF exports, and exclusive badges. Start today!",
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Premium | Bowel Buddies",
    description:
      "Upgrade to Bowel Buddies Premium for $4.99/mo or $39.99/yr. Unlock advanced analytics, unlimited history, PDF exports, and exclusive badges. Start today!",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bowel Buddies Premium - Unlock Advanced Features",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium | Bowel Buddies",
    description:
      "Upgrade to Bowel Buddies Premium for $4.99/mo or $39.99/yr. Unlock advanced analytics, unlimited history, PDF exports, and exclusive badges. Start today!",
    images: ["/og-image.png"],
  },
};

// Product structured data with Offers (JSON-LD)
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Bowel Buddies Premium",
  description:
    "Premium subscription for Bowel Buddies with advanced analytics, unlimited history, PDF exports, and exclusive features.",
  brand: {
    "@type": "Brand",
    name: "Bowel Buddies",
  },
  offers: [
    {
      "@type": "Offer",
      name: "Monthly Premium",
      price: "4.99",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: "https://bowelbuddies.app/premium",
    },
    {
      "@type": "Offer",
      name: "Annual Premium",
      price: "39.99",
      priceCurrency: "USD",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      url: "https://bowelbuddies.app/premium",
    },
  ],
};

const premiumFeatures = [
  {
    icon: "monitoring",
    title: "Advanced Analytics",
    description:
      "Dive deep into your gut health with detailed charts, trends, and insights that help you understand patterns over time.",
  },
  {
    icon: "history",
    title: "Unlimited History",
    description:
      "Never lose a log. Access your complete bowel movement history without any time restrictions or data limits.",
  },
  {
    icon: "description",
    title: "PDF & CSV Exports",
    description:
      "Generate professional reports for your doctor. Export your data in PDF or CSV format with a single click.",
  },
  {
    icon: "workspace_premium",
    title: "Premium Badges",
    description:
      "Unlock exclusive achievement badges that show off your dedication to gut health tracking.",
  },
  {
    icon: "palette",
    title: "Exclusive Themes",
    description:
      "Personalize your experience with premium color themes and app customization options.",
  },
  {
    icon: "support_agent",
    title: "Priority Support",
    description:
      "Get faster responses from our support team. Premium members get priority handling for all inquiries.",
  },
];

const featureComparison = [
  { feature: "Bristol Chart Tracking", free: true, premium: true },
  { feature: "Basic XP & Badges", free: true, premium: true },
  { feature: "Friend Connections", free: true, premium: true },
  { feature: "Privacy-First Storage", free: true, premium: true },
  { feature: "30-Day History", free: true, premium: true },
  { feature: "Advanced Analytics", free: false, premium: true },
  { feature: "Unlimited History", free: false, premium: true },
  { feature: "PDF/CSV Exports", free: false, premium: true },
  { feature: "Premium Badges", free: false, premium: true },
  { feature: "Exclusive Themes", free: false, premium: true },
  { feature: "Priority Support", free: false, premium: true },
  { feature: "Early Access to Features", free: false, premium: true },
];

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel your Premium subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data remains yours. If you cancel, you'll still have access to your full history, but premium features will be limited. We never delete your data without your permission.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! New Premium subscribers get a 7-day free trial. You won't be charged until the trial ends, and you can cancel anytime during the trial.",
  },
  {
    question: "Can I switch between monthly and annual plans?",
    answer:
      "Absolutely. You can switch between monthly ($4.99/mo) and annual ($39.99/yr) plans at any time. Annual plans save you over 30%!",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day money-back guarantee for annual subscriptions. If you're not satisfied, contact us within 14 days for a full refund.",
  },
];

export default function PremiumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <main className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="workspace_premium" className="text-lg" />
              Unlock Your Full Potential
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Go Premium for{" "}
              <span className="text-amber-600">Better Insights</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Take your gut health tracking to the next level with advanced
              analytics, unlimited history, and exclusive features designed for
              serious health enthusiasts.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-display mb-2">Free</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Everything you need to get started
                  </p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-bold font-display">$0</span>
                  <span className="text-slate-500 dark:text-slate-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-emerald-500 flex-shrink-0" />
                    <span>Bristol Chart tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-emerald-500 flex-shrink-0" />
                    <span>Basic XP & badges</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-emerald-500 flex-shrink-0" />
                    <span>Friend connections</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-emerald-500 flex-shrink-0" />
                    <span>30-day history</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <Icon name="cancel" className="text-slate-400 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <Icon name="cancel" className="text-slate-400 flex-shrink-0" />
                    <span>Data exports</span>
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="block w-full text-center py-4 rounded-full font-semibold border-2 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  Best Value
                </div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-display mb-2">Premium</h2>
                  <p className="text-amber-100">
                    For serious health tracking
                  </p>
                </div>
                <div className="mb-4">
                  <span className="text-5xl font-bold font-display">$4.99</span>
                  <span className="text-amber-200">/month</span>
                </div>
                <p className="text-amber-100 text-sm mb-8">
                  or $39.99/year (save 33%)
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>Unlimited history</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>PDF & CSV exports</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>Premium badges & themes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Icon name="check_circle" className="text-white flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Link
                  href="/upgrade"
                  className="block w-full text-center py-4 rounded-full font-semibold bg-white text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Grid */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Premium Features
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you get when you upgrade to Premium
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                    <Icon name={feature.icon} className="text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold font-display mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Compare Plans
            </h2>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 font-semibold text-sm uppercase tracking-wider">
                <div>Feature</div>
                <div className="text-center">Free</div>
                <div className="text-center text-amber-600">Premium</div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {featureComparison.map((item) => (
                  <div
                    key={item.feature}
                    className="grid grid-cols-3 gap-4 p-6 items-center"
                  >
                    <div className="text-slate-700 dark:text-slate-300">
                      {item.feature}
                    </div>
                    <div className="text-center">
                      {item.free ? (
                        <Icon name="check_circle" className="text-emerald-500 mx-auto" />
                      ) : (
                        <Icon name="cancel" className="text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {item.premium ? (
                        <Icon name="check_circle" className="text-amber-500 mx-auto" />
                      ) : (
                        <Icon name="cancel" className="text-slate-300 dark:text-slate-600 mx-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700"
                >
                  <h3 className="font-bold text-lg mb-3 flex items-start gap-3">
                    <Icon name="help" className="text-amber-500 flex-shrink-0 mt-1" />
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 pl-8">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-500/10 to-primary/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              Ready to Upgrade?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Join thousands of users who have taken their gut health tracking
              to the next level. Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/upgrade"
                className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition-colors"
              >
                <Icon name="workspace_premium" />
                Start Free Trial
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-8 py-4 rounded-full font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon name="login" />
                Continue with Free
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
