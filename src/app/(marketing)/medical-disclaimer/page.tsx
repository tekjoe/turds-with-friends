import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Medical Disclaimer | Bowel Buddies",
  description:
    "Important medical disclaimer: Bowel Buddies is a health tracking app for informational purposes only. Always consult health professionals for medical advice.",
  openGraph: {
    type: "article",
    title: "Medical Disclaimer | Bowel Buddies",
    description:
      "Important medical disclaimer: Bowel Buddies is a health tracking app for informational purposes only. Always consult health professionals for medical advice.",
    url: "https://bowelbuddies.app/medical-disclaimer",
  },
  twitter: {
    card: "summary",
    title: "Medical Disclaimer | Bowel Buddies",
    description:
      "Important medical disclaimer: Bowel Buddies is a health tracking app for informational purposes only. Always consult health professionals for medical advice.",
  },
  alternates: {
    canonical: "/medical-disclaimer",
  },
};

// WebPage structured data (JSON-LD)
const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Medical Disclaimer | Bowel Buddies",
  description:
    "Important medical disclaimer: Bowel Buddies is a health tracking app for informational purposes only. Always consult health professionals for medical advice.",
  url: "https://bowelbuddies.app/medical-disclaimer",
  isPartOf: {
    "@type": "WebSite",
    name: "Bowel Buddies",
    url: "https://bowelbuddies.app",
  },
  dateModified: "2025-02-11",
};

const sections = [
  { id: "not-medical-advice", title: "Not Medical Advice" },
  { id: "no-relationship", title: "No Doctor-Patient Relationship" },
  { id: "emergency", title: "Emergency Situations" },
  { id: "accuracy", title: "Information Accuracy" },
  { id: "responsibility", title: "User Responsibility" },
  { id: "consult-physician", title: "Consult Your Physician" },
  { id: "liability", title: "Liability Limitation" },
];

export default function MedicalDisclaimerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <div className="min-h-screen w-full text-slate-800 dark:text-slate-200">
        <main className="w-full">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Icon name="medical_services" className="text-base" />
                <span>Health &amp; Safety Notice</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-6">
                Medical Disclaimer
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
                Please read this important information about the limitations of our health tracking application.
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-500">
                Last Updated: February 11, 2025
              </p>
            </div>
          </section>

          {/* Warning Banner */}
          <section className="bg-amber-100 dark:bg-amber-900/20 border-y border-amber-200 dark:border-amber-800">
            <div className="max-w-4xl mx-auto py-6 px-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-200 dark:bg-amber-800 rounded-full flex items-center justify-center">
                  <Icon name="warning" className="text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold text-amber-800 dark:text-amber-400 mb-2">
                    Important Warning
                  </h2>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    Bowel Buddies is a health tracking and educational tool intended for informational purposes only. 
                    It is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="py-16 px-6 bg-[#FDFBF7] dark:bg-[#1A1614]">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_280px] gap-12">
                {/* Main Content */}
                <div className="order-2 lg:order-1">
                  <div className="prose dark:prose-invert max-w-none">
                    {/* Not Medical Advice */}
                    <div id="not-medical-advice" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="info" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Not Medical Advice
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          The content provided by Bowel Buddies, including but not limited to text, graphics, 
                          images, charts, and other material, is for informational and educational purposes only. 
                          It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          The Bristol Stool Chart and other health information provided within the app are educational 
                          tools meant to help you better understand and communicate about your digestive health. 
                          They do not constitute medical advice tailored to your specific situation.
                        </p>
                      </div>
                    </div>

                    {/* No Doctor-Patient Relationship */}
                    <div id="no-relationship" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="person_off" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          No Doctor-Patient Relationship
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          Use of Bowel Buddies does not create a doctor-patient relationship between you and the 
                          creators, developers, or operators of the application. No confidential relationship is 
                          established, and communications through the app are not privileged or protected as 
                          medical communications would be.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          The app does not provide personalized medical recommendations, diagnoses, or treatment plans. 
                          Any health-related decisions should be made in consultation with qualified healthcare 
                          professionals who can evaluate your individual circumstances.
                        </p>
                      </div>
                    </div>

                    {/* Emergency Situations */}
                    <div id="emergency" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <Icon name="emergency" className="text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Emergency Situations
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                          <p className="text-red-800 dark:text-red-300 font-semibold mb-2">
                            If you are experiencing a medical emergency, call 911 immediately (or your local emergency number).
                          </p>
                          <p className="text-red-700 dark:text-red-400 text-sm">
                            Do not rely on Bowel Buddies or any information within the app for emergency medical situations. 
                            Seek immediate professional medical attention for severe symptoms including:
                          </p>
                          <ul className="mt-3 space-y-1 text-red-700 dark:text-red-400 text-sm">
                            <li>• Severe abdominal pain or cramping</li>
                            <li>• Blood in stool or black, tarry stools</li>
                            <li>• Persistent vomiting or inability to keep fluids down</li>
                            <li>• Signs of severe dehydration</li>
                            <li>• High fever with gastrointestinal symptoms</li>
                            <li>• Sudden, unexplained weight loss</li>
                          </ul>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          Bowel Buddies is not designed to handle medical emergencies. Always err on the side of caution 
                          and seek immediate professional care when experiencing severe or concerning symptoms.
                        </p>
                      </div>
                    </div>

                    {/* Information Accuracy */}
                    <div id="accuracy" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="verified" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Information Accuracy
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          While we strive to provide accurate and up-to-date health information, we make no representations 
                          or warranties of any kind, express or implied, about the completeness, accuracy, reliability, 
                          suitability, or availability of the information contained within the app.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          Health information is constantly evolving as new research emerges. The content in Bowel Buddies 
                          may not always reflect the most current medical knowledge or best practices. We recommend 
                          consulting multiple authoritative sources and healthcare professionals for important health decisions.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          Any reliance you place on information provided by Bowel Buddies is strictly at your own risk. 
                          We disclaim all liability for any loss or damage arising from such reliance.
                        </p>
                      </div>
                    </div>

                    {/* User Responsibility */}
                    <div id="responsibility" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="assignment_ind" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          User Responsibility
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          You are solely responsible for your health and wellness decisions. Bowel Buddies is designed 
                          to be a tool that helps you track and reflect on your digestive health patterns, but the 
                          responsibility for interpreting this information and taking appropriate action rests entirely with you.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          When using the app to track symptoms or patterns, you acknowledge that:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed mb-4 space-y-2">
                          <li>You are responsible for accurately recording your data</li>
                          <li>You understand that app insights are based on your inputs and may not reflect your complete health picture</li>
                          <li>You will use your own judgment and seek professional advice when needed</li>
                          <li>You will not delay seeking medical attention based on app information</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          Never disregard professional medical advice or delay seeking it because of something you have 
                          read or interpreted from using Bowel Buddies.
                        </p>
                      </div>
                    </div>

                    {/* Consult Your Physician */}
                    <div id="consult-physician" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="stethoscope" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Consult Your Physician
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          We strongly encourage you to consult with a qualified healthcare provider before making any 
                          significant changes to your diet, lifestyle, or health routine based on information or insights 
                          from Bowel Buddies.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          This is particularly important if you:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed mb-4 space-y-2">
                          <li>Have existing medical conditions or chronic illnesses</li>
                          <li>Are taking prescription medications</li>
                          <li>Are pregnant, planning pregnancy, or breastfeeding</li>
                          <li>Are under the age of 18</li>
                          <li>Are elderly or have compromised immune systems</li>
                          <li>Notice persistent changes in your bowel habits</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          Your physician can provide personalized guidance based on your complete medical history, 
                          current medications, and individual health needs.
                        </p>
                      </div>
                    </div>

                    {/* Liability Limitation */}
                    <div id="liability" className="mb-12 scroll-mt-24">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Icon name="gavel" className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                          Liability Limitation
                        </h2>
                      </div>
                      <div className="pl-13 ml-0 md:ml-[52px]">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          To the fullest extent permitted by applicable law, Bowel Buddies and its creators, developers, 
                          operators, affiliates, and licensors shall not be liable for any direct, indirect, incidental, 
                          special, consequential, or punitive damages arising out of or relating to your use of, or 
                          inability to use, the application.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          This includes, but is not limited to, damages for:
                        </p>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed mb-4 space-y-2">
                          <li>Personal injury, pain and suffering, or emotional distress</li>
                          <li>Medical expenses or health complications</li>
                          <li>Loss of profits, data, or business opportunities</li>
                          <li>Any other damages resulting from decisions made based on app information</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          By using Bowel Buddies, you acknowledge and agree that you assume all risks associated with 
                          using the application for health tracking and educational purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Navigation */}
                <div className="order-1 lg:order-2">
                  <div className="lg:sticky lg:top-24 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Icon name="menu" className="text-slate-500" />
                      On This Page
                    </h3>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          className="block text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors py-1.5 border-l-2 border-transparent hover:border-primary pl-3"
                        >
                          {section.title}
                        </a>
                      ))}
                    </nav>

                    {/* Related Documents */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Icon name="description" className="text-slate-500" />
                        Related Documents
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <Link
                            href="/terms"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <Icon name="contract" className="text-xs" />
                            Terms of Service
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/privacy"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <Icon name="shield" className="text-xs" />
                            Privacy Policy
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/contact"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <Icon name="mail" className="text-xs" />
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
