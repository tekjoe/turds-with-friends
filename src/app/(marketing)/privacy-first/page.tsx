import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Privacy First | Bowel Buddies",
  description:
    "Your health data stays private with Bowel Buddies. Local-first storage, end-to-end encryption, complete user control. We never sell your sensitive data.",
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Privacy First | Bowel Buddies",
    description:
      "Your health data stays private with Bowel Buddies. Local-first storage, end-to-end encryption, complete user control. We never sell your sensitive data.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bowel Buddies Privacy First - Your Data, Your Control",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy First | Bowel Buddies",
    description:
      "Your health data stays private with Bowel Buddies. Local-first storage, end-to-end encryption, complete user control. We never sell your sensitive data.",
    images: ["/og-image.png"],
  },
};

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy First | Bowel Buddies",
  description:
    "Your health data stays private with Bowel Buddies. Local-first storage, end-to-end encryption, complete user control. We never sell your sensitive data.",
  url: "https://bowelbuddies.app/privacy-first",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  mainEntity: {
    "@type": "Article",
    headline: "Privacy-First Health Tracking",
    description: "How Bowel Buddies protects your sensitive health data",
  },
};

const privacyFeatures = [
  {
    icon: "devices",
    title: "Local-First Architecture",
    description:
      "Your data lives primarily on your device, not our servers. This means faster access, offline functionality, and reduced exposure to data breaches.",
    details: [
      "Data stored locally by default",
      "Works fully offline",
      "No cloud dependency for core features",
      "Reduced attack surface",
    ],
  },
  {
    icon: "lock",
    title: "End-to-End Encryption",
    description:
      "When data does sync to the cloud, it's encrypted before it leaves your device. Only you hold the keys to decrypt your health information.",
    details: [
      "AES-256 encryption standard",
      "Client-side encryption keys",
      "Encrypted in transit and at rest",
      "Zero-knowledge architecture",
    ],
  },
  {
    icon: "person",
    title: "Complete User Control",
    description:
      "You own your data. Export it, delete it, or take it with you at any time. No questions asked, no hoops to jump through.",
    details: [
      "One-click data export",
      "Full account deletion",
      "Granular privacy settings",
      "Transparent data usage",
    ],
  },
  {
    icon: "block",
    title: "What We Don't Collect",
    description:
      "We believe in data minimization. We don't collect information we don't need to provide our service.",
    details: [
      "No personal identifiers sold",
      "No third-party ad tracking",
      "No browsing history collected",
      "No health data shared with partners",
    ],
  },
];

export default function PrivacyFirstPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <main className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-900/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="verified" className="text-lg" />
              Privacy-First by Design
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Your Health Data is{" "}
              <span className="text-purple-600">Yours Alone</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              We built Bowel Buddies with privacy at its core. Local-first
              storage, military-grade encryption, and a commitment to never
              selling your data.
            </p>
          </div>
        </section>

        {/* Privacy Features Grid */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {privacyFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <Icon name={feature.icon} className="text-3xl" />
                  </div>
                  <h2 className="text-xl font-bold font-display mb-3">
                    {feature.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((item) => (
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

        {/* HIPAA Section */}
        <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-lg border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Icon name="health_and_safety" className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold font-display">
                  HIPAA Considerations
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>
                  Bowel Buddies is designed with health data protection principles
                  in mind. While we are not a covered entity under HIPAA, we
                  voluntarily implement many HIPAA-aligned security practices:
                </p>
                <ul className="grid sm:grid-cols-2 gap-3 mt-6">
                  <li className="flex items-start gap-3">
                    <Icon name="shield" className="text-primary flex-shrink-0 mt-0.5" />
                    <span>Administrative safeguards for data access</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="encrypted" className="text-primary flex-shrink-0" />
                    <span>Physical safeguards via encryption</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="policy" className="text-primary flex-shrink-0" />
                    <span>Technical safeguards and audit logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="update" className="text-primary flex-shrink-0" />
                    <span>Regular security updates and monitoring</span>
                  </li>
                </ul>
                <p className="mt-6 text-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <strong>Note:</strong> Bowel Buddies is a wellness application,
                  not a medical device or healthcare provider. Always consult
                  healthcare professionals for medical advice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Practices Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold font-display text-center mb-12">
              Our Data Practices
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="save" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">What We Store</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Only your bowel movement logs, basic profile information,
                    and app preferences. All encrypted and tied to your account.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="sync" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">How We Sync</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Data syncs only when you're logged in and explicitly enable
                    cloud backup. Local data remains primary.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="delete_forever" className="text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">How We Delete</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Delete your account and we remove all associated data within
                    30 days. Local data can be cleared instantly from your device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-500/10 to-primary/10 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold font-display mb-4">
              Trust Starts with Transparency
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
              Read our full Privacy Policy to understand exactly how we handle
              your data, or reach out if you have questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/privacy"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                <Icon name="policy" />
                Read Privacy Policy
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-8 py-4 rounded-full font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <Icon name="mail" />
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
