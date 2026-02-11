import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Terms of Service | Bowel Buddies",
  description:
    "Read Bowel Buddies Terms of Service. Learn about user accounts, acceptable use, content policies, and liability limitations for our health tracking app.",
  openGraph: {
    type: "website",
    siteName: "Bowel Buddies",
    title: "Terms of Service | Bowel Buddies",
    description:
      "Read Bowel Buddies Terms of Service. Learn about user accounts, acceptable use, content policies, and liability limitations for our health tracking app.",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bowel Buddies Terms of Service",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | Bowel Buddies",
    description:
      "Read Bowel Buddies Terms of Service. Learn about user accounts, acceptable use, content policies, and liability limitations for our health tracking app.",
    images: ["/og-image.png"],
  },
};

// WebPage structured data for SEO
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service",
  description: "Terms of Service for Bowel Buddies health tracking application",
  url: "https://bowelbuddies.app/terms",
  lastReviewed: "2026-02-11",
  publisher: {
    "@type": "Organization",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
};

const lastUpdated = "February 11, 2026";

const tocSections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "accounts", title: "User Accounts" },
  { id: "use", title: "Acceptable Use" },
  { id: "content", title: "User Content" },
  { id: "termination", title: "Termination" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Us" },
];

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <main className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="gavel" className="text-lg" />
              Legal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Please read these terms carefully before using Bowel Buddies. By
              accessing or using our service, you agree to be bound by these
              terms.
            </p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
              Last updated: <strong>{lastUpdated}</strong>
            </p>
          </div>
        </section>

        {/* Content with Navigation */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents - Sticky Sidebar */}
              <div className="hidden lg:block">
                <nav className="sticky top-8">
                  <h2 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-4">
                    Contents
                  </h2>
                  <ul className="space-y-2">
                    {tocSections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors py-1"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 prose prose-slate dark:prose-invert max-w-none">
                {/* Acceptance of Terms */}
                <section id="acceptance" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      1
                    </span>
                    Acceptance of Terms
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      Welcome to Bowel Buddies. These Terms of Service (&quot;Terms&quot;)
                      govern your access to and use of the Bowel Buddies website,
                      mobile application, and services (collectively, the &quot;Service&quot;).
                    </p>
                    <p>
                      By accessing or using the Service, you agree to be bound by
                      these Terms. If you disagree with any part of the terms, you
                      may not access the Service. These Terms apply to all visitors,
                      users, and others who access or use the Service.
                    </p>
                    <p>
                      You must be at least 13 years old to use the Service. By using
                      the Service, you represent and warrant that you are at least
                      13 years of age and have the legal capacity to enter into
                      these Terms.
                    </p>
                  </div>
                </section>

                {/* User Accounts */}
                <section id="accounts" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      2
                    </span>
                    User Accounts
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      When you create an account with us, you must provide
                      information that is accurate, complete, and current at all
                      times. Failure to do so constitutes a breach of the Terms,
                      which may result in immediate termination of your account.
                    </p>
                    <p>
                      You are responsible for safeguarding the password that you
                      use to access the Service and for any activities or actions
                      under your password. You agree not to disclose your password
                      to any third party. You must notify us immediately upon
                      becoming aware of any breach of security or unauthorized
                      use of your account.
                    </p>
                    <p>
                      You may not use as a username the name of another person or
                      entity that is not lawfully available for use, or a name or
                      trademark that is subject to any rights of another person or
                      entity without appropriate authorization.
                    </p>
                  </div>
                </section>

                {/* Acceptable Use */}
                <section id="use" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      3
                    </span>
                    Acceptable Use
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      You agree to use the Service only for lawful purposes and
                      in accordance with these Terms. You agree not to use the
                      Service:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        In any way that violates any applicable federal, state,
                        local, or international law or regulation.
                      </li>
                      <li>
                        To transmit, or procure the sending of, any advertising
                        or promotional material, including any &quot;junk mail,&quot;
                        &quot;chain letter,&quot; &quot;spam,&quot; or any other similar solicitation.
                      </li>
                      <li>
                        To impersonate or attempt to impersonate Bowel Buddies,
                        a Bowel Buddies employee, another user, or any other
                        person or entity.
                      </li>
                      <li>
                        To engage in any other conduct that restricts or inhibits
                        anyone&apos;s use or enjoyment of the Service, or which may
                        harm Bowel Buddies or users of the Service.
                      </li>
                      <li>
                        To attempt to gain unauthorized access to, interfere with,
                        damage, or disrupt any parts of the Service.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* User Content */}
                <section id="content" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      4
                    </span>
                    User Content
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      The Service allows you to store and track personal health
                      information, including but not limited to bowel movement
                      data, symptoms, and notes (&quot;User Content&quot;).
                    </p>
                    <p>
                      You retain all rights to your User Content. By providing
                      User Content to the Service, you grant Bowel Buddies a
                      limited license to use, store, and process your User Content
                      solely for the purpose of providing and improving the Service.
                    </p>
                    <p>
                      You are solely responsible for the User Content you provide
                      and the consequences of sharing it. We do not monitor all
                      User Content, but we reserve the right to remove any User
                      Content that violates these Terms.
                    </p>
                    <p>
                      User Content that you choose to share with friends or
                      healthcare providers through the Service is shared at your
                      own risk. Please be mindful of the sensitivity of health
                      information when sharing.
                    </p>
                  </div>
                </section>

                {/* Termination */}
                <section id="termination" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      5
                    </span>
                    Termination
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      We may terminate or suspend your account immediately,
                      without prior notice or liability, for any reason
                      whatsoever, including without limitation if you breach
                      the Terms.
                    </p>
                    <p>
                      Upon termination, your right to use the Service will
                      immediately cease. If you wish to terminate your account,
                      you may simply discontinue using the Service or contact
                      us to request account deletion.
                    </p>
                    <p>
                      All provisions of the Terms which by their nature should
                      survive termination shall survive termination, including,
                      without limitation, ownership provisions, warranty
                      disclaimers, indemnity, and limitations of liability.
                    </p>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="liability" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      6
                    </span>
                    Limitation of Liability
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      To the maximum extent permitted by applicable law, Bowel
                      Buddies and its directors, employees, partners, agents,
                      suppliers, or affiliates shall not be liable for any
                      indirect, incidental, special, consequential, or punitive
                      damages, including without limitation, loss of profits,
                      data, use, goodwill, or other intangible losses, resulting
                      from:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Your access to or use of or inability to access or use
                        the Service.
                      </li>
                      <li>
                        Any conduct or content of any third party on the Service.
                      </li>
                      <li>
                        Any content obtained from the Service.
                      </li>
                      <li>
                        Unauthorized access, use, or alteration of your
                        transmissions or content.
                      </li>
                    </ul>
                    <p>
                      In no event shall our total liability to you for all
                      claims exceed the amount you have paid to us for the
                      Service in the twelve (12) months preceding the event
                      giving rise to liability, or one hundred dollars ($100),
                      whichever is greater.
                    </p>
                  </div>
                </section>

                {/* Changes to Terms */}
                <section id="changes" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      7
                    </span>
                    Changes to Terms
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      We reserve the right, at our sole discretion, to modify
                      or replace these Terms at any time. If a revision is
                      material, we will try to provide at least 30 days&apos; notice
                      prior to any new terms taking effect.
                    </p>
                    <p>
                      What constitutes a material change will be determined at
                      our sole discretion. By continuing to access or use our
                      Service after those revisions become effective, you agree
                      to be bound by the revised terms.
                    </p>
                    <p>
                      We encourage you to review these Terms periodically for
                      any changes. Changes to these Terms are effective when
                      they are posted on this page.
                    </p>
                  </div>
                </section>

                {/* Contact Us */}
                <section id="contact" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold font-display mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">
                      8
                    </span>
                    Contact Us
                  </h2>
                  <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
                    <p>
                      If you have any questions about these Terms, please
                      contact us:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        By email:{" "}
                        <a
                          href="mailto:support@bowelbuddies.app"
                          className="text-primary hover:underline"
                        >
                          support@bowelbuddies.app
                        </a>
                      </li>
                      <li>
                        By visiting our{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                          Contact page
                        </Link>
                      </li>
                    </ul>
                    <p className="mt-6">
                      These Terms were last updated on {lastUpdated}.
                    </p>
                  </div>
                </section>

                {/* Back to Top */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Icon name="arrow_upward" />
                    Back to top
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 px-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-bold font-display mb-6">
              Related Documents
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
              >
                <Icon name="shield" className="text-primary" />
                Privacy Policy
              </Link>
              <Link
                href="/medical-disclaimer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
              >
                <Icon name="medical_services" className="text-primary" />
                Medical Disclaimer
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary transition-colors"
              >
                <Icon name="mail" className="text-primary" />
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
