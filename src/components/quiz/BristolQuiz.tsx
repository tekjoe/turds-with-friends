"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ShareButton } from "@/components/ui/ShareButton";

interface Question {
  id: string;
  question: string;
  options: { label: string; value: string; points: number }[];
}

const questions: Question[] = [
  {
    id: "consistency",
    question: "How would you best describe your typical stool consistency?",
    options: [
      { label: "Hard, separate lumps (like nuts)", value: "type1", points: 1 },
      { label: "Lumpy and sausage-shaped", value: "type2", points: 2 },
      { label: "Sausage-shaped with surface cracks", value: "type3", points: 5 },
      { label: "Smooth, soft sausage or snake", value: "type4", points: 5 },
      { label: "Soft blobs with clear edges", value: "type5", points: 3 },
      { label: "Mushy with ragged edges", value: "type6", points: 2 },
      { label: "Entirely liquid, no solid pieces", value: "type7", points: 1 },
    ],
  },
  {
    id: "frequency",
    question: "How often do you typically have a bowel movement?",
    options: [
      { label: "Less than 3 times per week", value: "low", points: 1 },
      { label: "3-4 times per week", value: "moderate_low", points: 3 },
      { label: "About once per day", value: "daily", points: 5 },
      { label: "2-3 times per day", value: "frequent", points: 4 },
      { label: "More than 3 times per day", value: "very_frequent", points: 2 },
    ],
  },
  {
    id: "ease",
    question: "How easy is it for you to have a bowel movement?",
    options: [
      { label: "Very difficult, requires straining", value: "difficult", points: 1 },
      { label: "Sometimes requires effort", value: "moderate", points: 3 },
      { label: "Easy and comfortable", value: "easy", points: 5 },
      { label: "Urgent, hard to control", value: "urgent", points: 2 },
    ],
  },
  {
    id: "regularity",
    question: "How consistent is your bowel routine?",
    options: [
      { label: "Very unpredictable, no pattern", value: "irregular", points: 1 },
      { label: "Somewhat regular with occasional changes", value: "somewhat", points: 3 },
      { label: "Very regular, predictable pattern", value: "regular", points: 5 },
    ],
  },
  {
    id: "fiber",
    question: "How would you describe your daily fiber intake?",
    options: [
      { label: "Low (mostly processed foods, few fruits/veg)", value: "low", points: 1 },
      { label: "Moderate (some fruits, veg, and whole grains)", value: "moderate", points: 3 },
      { label: "High (lots of fruits, veg, legumes, whole grains)", value: "high", points: 5 },
    ],
  },
  {
    id: "water",
    question: "How much water do you drink daily?",
    options: [
      { label: "Less than 4 glasses", value: "low", points: 1 },
      { label: "4-6 glasses", value: "moderate", points: 3 },
      { label: "6-8 glasses", value: "good", points: 4 },
      { label: "More than 8 glasses", value: "excellent", points: 5 },
    ],
  },
];

interface Result {
  score: number;
  grade: "excellent" | "good" | "fair" | "poor";
  title: string;
  description: string;
  tips: string[];
  color: string;
}

function getResult(totalPoints: number, maxPoints: number): Result {
  const percentage = (totalPoints / maxPoints) * 100;

  if (percentage >= 80) {
    return {
      score: Math.round(percentage),
      grade: "excellent",
      title: "Your Gut is Golden!",
      description:
        "Your bowel habits are in excellent shape. You're hitting all the markers of a healthy digestive system. Keep doing what you're doing!",
      tips: [
        "Maintain your current fiber intake",
        "Continue staying hydrated",
        "Keep up your regular routine",
      ],
      color: "text-green-600 dark:text-green-400",
    };
  }

  if (percentage >= 60) {
    return {
      score: Math.round(percentage),
      grade: "good",
      title: "Looking Good, Room to Grow",
      description:
        "Your digestive health is solid, but there's room for improvement. A few small changes could make a big difference.",
      tips: [
        "Try adding more fiber-rich foods to your diet",
        "Aim for at least 6-8 glasses of water daily",
        "Consider a daily walk to boost regularity",
      ],
      color: "text-blue-600 dark:text-blue-400",
    };
  }

  if (percentage >= 40) {
    return {
      score: Math.round(percentage),
      grade: "fair",
      title: "Some Attention Needed",
      description:
        "Your bowel habits suggest your digestive system could use some help. Diet, hydration, and lifestyle changes can make a real difference.",
      tips: [
        "Gradually increase fiber to 25-30g daily",
        "Drink more water throughout the day",
        "Try to establish a consistent bathroom routine",
        "Consider tracking your meals to find triggers",
      ],
      color: "text-yellow-600 dark:text-yellow-400",
    };
  }

  return {
    score: Math.round(percentage),
    grade: "poor",
    title: "Time for a Gut Check",
    description:
      "Your bowel habits indicate your digestive system needs attention. Consider consulting a healthcare professional, especially if you've noticed recent changes.",
    tips: [
      "See a healthcare provider about your symptoms",
      "Start a food diary to identify triggers",
      "Increase water intake immediately",
      "Add fiber gradually (too fast can worsen symptoms)",
      "Consider a probiotic supplement",
    ],
    color: "text-red-600 dark:text-red-400",
  };
}

export function BristolQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: string; points: number }>>({});
  const [showResult, setShowResult] = useState(false);

  const maxPoints = questions.reduce(
    (sum, q) => sum + Math.max(...q.options.map((o) => o.points)),
    0,
  );

  const totalPoints = Object.values(answers).reduce((sum, a) => sum + a.points, 0);
  const result = getResult(totalPoints, maxPoints);

  const handleAnswer = (questionId: string, value: string, points: number) => {
    const newAnswers = { ...answers, [questionId]: { value, points } };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
  };

  const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

  if (showResult) {
    return (
      <div className="w-full">
        <section className="pt-32 pb-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Score circle */}
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-light text-white mb-6 shadow-lg">
              <div>
                <p className="text-4xl font-bold">{result.score}</p>
                <p className="text-xs uppercase tracking-wider opacity-80">Score</p>
              </div>
            </div>

            <h1 className={`text-3xl md:text-4xl font-bold font-display mb-4 ${result.color}`}>
              {result.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              {result.description}
            </p>

            {/* Tips */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 text-left mb-8">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">
                Our Recommendations
              </h3>
              <ul className="space-y-3">
                {result.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Icon name="check_circle" className="text-green-500 text-lg flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-full transition-colors"
              >
                <Icon name="trending_up" className="text-xl" />
                Start Tracking for Free
              </Link>
              <ShareButton
                title="My Bowel Health Score"
                text={`I scored ${result.score}/100 on the Bowel Buddies Bristol Scale Quiz! ${result.title}`}
              />
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold py-3 px-6 rounded-full transition-colors"
              >
                <Icon name="refresh" className="text-xl" />
                Retake Quiz
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="w-full">
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          {currentQuestion === 0 && (
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-slate-800 dark:text-slate-100">
                Is My Poop <span className="text-primary">Normal?</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Take this quick 6-question quiz based on the medical Bristol Stool Scale
                to assess your digestive health.
              </p>
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id]?.value === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value, option.points)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                        : "border-slate-100 dark:border-slate-700 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    }`}
                  >
                    <span className={`text-sm ${isSelected ? "text-primary font-semibold" : "text-slate-700 dark:text-slate-300"}`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Back button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="mt-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              <Icon name="arrow_back" className="text-lg" />
              Previous question
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
