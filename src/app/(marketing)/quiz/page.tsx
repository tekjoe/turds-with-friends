import type { Metadata } from "next";
import { BristolQuiz } from "@/components/quiz/BristolQuiz";

export const metadata: Metadata = {
  title: "Is My Poop Normal? Free Bristol Scale Quiz | Bowel Buddies",
  description:
    "Take our free interactive Bristol Scale quiz to find out if your bowel movements are healthy. Get personalized insights based on medical guidelines.",
  keywords: [
    "is my poop normal",
    "bristol scale quiz",
    "poop quiz",
    "stool assessment",
    "bowel health quiz",
    "digestive health assessment",
  ],
  openGraph: {
    title: "Is My Poop Normal? Take the Free Quiz",
    description:
      "Take our free interactive Bristol Scale quiz to find out if your bowel movements are healthy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is My Poop Normal? Take the Free Quiz",
    description:
      "Take our free interactive Bristol Scale quiz to find out if your bowel movements are healthy.",
  },
};

const quizSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Is My Poop Normal? Free Bristol Scale Quiz",
  description:
    "Take our free interactive Bristol Scale quiz to find out if your bowel movements are healthy.",
  url: "https://bowelbuddies.app/quiz",
  isPartOf: {
    "@type": "WebSite",
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
      name: "Is my poop normal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Normal poop is generally Bristol Type 3 (sausage-shaped with cracks) or Type 4 (smooth, soft sausage). It should be easy to pass and brown in color. Take our free quiz to assess your bowel health based on the medical Bristol Stool Scale.",
      },
    },
    {
      "@type": "Question",
      name: "What does the Bristol Stool Scale measure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bristol Stool Scale classifies stool into 7 types based on form and consistency, ranging from Type 1 (hard lumps indicating constipation) to Type 7 (liquid indicating diarrhea). Types 3 and 4 are considered ideal and indicate healthy digestion.",
      },
    },
  ],
};

export default function QuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BristolQuiz />
    </>
  );
}
