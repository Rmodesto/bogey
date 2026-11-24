"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, RotateCcw, TrendingUp, Home } from "lucide-react";
import { generateExamFrom } from "@/lib/part107/examCore";
import { toLegacyQuestion } from "@/lib/part107/legacy";
import type { DenormalizedQuestion, DenormalizedBlueprint } from "@/lib/part107/loaders";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import ProgressBar from "@/components/ProgressBar";

function barColor(pct: number) {
  if (pct >= 80) return "bg-volt-green";
  if (pct >= 60) return "bg-deep-ice-blue";
  return "bg-red-400";
}

const LEGACY_FIXED_SEED = 42;

function ResultsContent({
  bank,
  blueprint,
}: {
  bank: DenormalizedQuestion[];
  blueprint: DenormalizedBlueprint;
}) {
  const searchParams = useSearchParams();
  // Rebuild the exact exam this attempt sat: the seed travels from /exam in
  // the URL. Old links without a seed fall back to the historical fixed draw.
  const seed = Number(searchParams.get("seed")) || LEGACY_FIXED_SEED;
  const examQuestions = useMemo(
    () => generateExamFrom(bank, blueprint, { seed }).map((q, i) => toLegacyQuestion(q, i)),
    [bank, blueprint, seed]
  );
  // Query params are user-editable: clamp the numbers to what this exam can
  // actually produce and never let a malformed answers payload crash the page.
  const total = examQuestions.length;
  const score = Math.min(Math.max(Number(searchParams.get("score")) || 0, 0), total);
  const timeSpent = Math.max(Number(searchParams.get("time")) || 0, 0);
  let userAnswers: (number | null)[] = [];
  try {
    const parsed = JSON.parse(searchParams.get("answers") || "[]");
    if (Array.isArray(parsed)) {
      userAnswers = parsed.map((a) => (typeof a === "number" ? a : null)).slice(0, total);
    }
  } catch {
    userAnswers = [];
  }

  const percentage = Math.round((score / total) * 100);
  // Pass/fail is a count comparison, never a rounded percentage
  const required = Math.ceil(blueprint.passingScore * total);
  const passed = score >= required;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  // Domain breakdown
  const domainMap: Record<string, { correct: number; total: number }> = {};
  examQuestions.forEach((q, i) => {
    if (!domainMap[q.domain]) domainMap[q.domain] = { correct: 0, total: 0 };
    domainMap[q.domain].total++;
    if (userAnswers[i] === q.correctAnswer) domainMap[q.domain].correct++;
  });

  const missed = examQuestions
    .map((q, i) => ({ ...q, userAnswer: userAnswers[i], index: i }))
    .filter((q) => q.userAnswer !== q.correctAnswer);

  return (
    <div className="min-h-screen bg-fog-gray">
      <header className="bg-white border-b border-divider-gray px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-semibold text-jet-black text-lg">Exam Results</h1>
          <Link href="/dashboard" className="flex items-center gap-2 text-slate hover:text-jet-black text-sm">
            <Home className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Result banner */}
        <div className={`rounded-xl p-8 mb-6 border ${passed ? "bg-volt-mist border-volt-green" : "bg-red-50 border-red-300"}`}>
          <div className="text-center">
            {passed ? (
              <CheckCircle className="w-16 h-16 text-volt-green mx-auto mb-4" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            )}
            <h2 className="text-4xl font-semibold text-jet-black mb-2">
              {passed ? "Congratulations!" : "Keep Studying"}
            </h2>
            <p className="text-slate mb-6">
              {passed
                ? "You passed the practice exam! You're well-prepared for the FAA Part 107 knowledge test."
                : "You didn't pass this time, but don't worry — review the areas below and try again."}
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <p className="text-5xl font-semibold text-jet-black">{percentage}%</p>
                <p className="text-slate text-sm">Score</p>
              </div>
              <div>
                <p className="text-5xl font-semibold text-jet-black">{score}/{total}</p>
                <p className="text-slate text-xs mt-1">{required} of {total} needed to pass</p>
                <p className="text-slate text-sm">Correct</p>
              </div>
              <div>
                <p className="text-5xl font-semibold text-jet-black">{minutes}:{String(seconds).padStart(2, "0")}</p>
                <p className="text-slate text-sm">Time Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button href="/exam">
            <RotateCcw className="w-4 h-4" /> Retake Exam
          </Button>
          <Button href="/study" variant="outline">
            <TrendingUp className="w-4 h-4" /> Continue Studying
          </Button>
        </div>

        {/* Domain performance */}
        <Card className="mb-8">
          <h2 className="font-semibold text-jet-black text-lg mb-4">Performance by Domain</h2>
          <div className="space-y-4">
            {Object.entries(domainMap).map(([domain, data]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={domain}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-jet-black">{domain}</span>
                    <span className="text-sm text-slate">{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} colorFn={barColor} />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Missed questions */}
        {missed.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-jet-black text-lg mb-4">Questions to Review</h2>
            <div className="space-y-4">
              {missed.map((q) => (
                <Card key={q.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-medium text-jet-black">Question {q.index + 1}</span>
                    <Badge>{q.domain}</Badge>
                  </div>
                  <p className="text-sm text-jet-black mb-4">{q.question}</p>
                  <div className="space-y-2">
                    <div className="bg-red-50 border-l-4 border-red-400 rounded-r-lg p-3">
                      <p className="text-xs text-slate mb-0.5">Your Answer</p>
                      <p className="text-sm text-jet-black">{q.userAnswer !== null ? q.options[q.userAnswer] : "Not answered"}</p>
                    </div>
                    <div className="bg-volt-mist border-l-4 border-volt-green rounded-r-lg p-3">
                      <p className="text-xs text-slate mb-0.5">Correct Answer</p>
                      <p className="text-sm text-jet-black">{q.options[q.correctAnswer]}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-mist-blue rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-jet-black mb-2">
            {passed ? "Ready for the Real Exam?" : "Focus on Your Weak Areas"}
          </h2>
          <p className="text-slate mb-4">
            {passed
              ? "Keep practicing to maintain your readiness score and build confidence."
              : "Review the domains where you scored lowest and practice targeted questions."}
          </p>
          <Button href={passed ? "/dashboard" : "/study"}>
            {passed ? "Go to Dashboard" : "Start Studying"}
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ResultsClient({
  bank,
  blueprint,
}: {
  bank: DenormalizedQuestion[];
  blueprint: DenormalizedBlueprint;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-fog-gray flex items-center justify-center text-slate">Loading results...</div>}>
      <ResultsContent bank={bank} blueprint={blueprint} />
    </Suspense>
  );
}
