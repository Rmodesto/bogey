"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";
import { getStudyQuestions } from "@/lib/part107/compat";

const studyQuestions = getStudyQuestions();
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

export default function StudyMode() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const question = studyQuestions[currentIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isLast = currentIndex === studyQuestions.length - 1;

  function handleSelect(index: number) {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
  }

  function handleNext() {
    setCurrentIndex((i) => i + 1);
    setSelectedAnswer(null);
    setAnswered(false);
  }

  function optionClass(index: number) {
    const base = "w-full text-left p-4 rounded-xl border flex items-center gap-3 text-sm font-medium";
    if (!answered) {
      if (selectedAnswer === index) return `${base} border-deep-ice-blue bg-mist-blue text-jet-black`;
      return `${base} border-divider-gray hover:border-slate text-jet-black`;
    }
    if (index === question.correctAnswer) return `${base} border-volt-green bg-volt-mist text-jet-black`;
    if (index === selectedAnswer) return `${base} border-red-400 bg-red-50 text-jet-black`;
    return `${base} border-divider-gray text-slate`;
  }

  return (
    <div className="min-h-screen bg-fog-gray">
      <header className="bg-white border-b border-divider-gray px-6 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate hover:text-jet-black text-sm">
            <span className="w-4 h-4 inline-flex"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg></span> Back to Dashboard
          </Link>
          <span className="text-sm text-slate">
            Question {currentIndex + 1} of {studyQuestions.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full bg-divider-gray h-1.5">
        <div
          className="bg-volt-green h-1.5 rounded-r-full"
          style={{ width: `${((currentIndex + (answered ? 1 : 0)) / studyQuestions.length) * 100}%` }}
        />
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Domain badge */}
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-4 h-4 text-deep-ice-blue" />
          <Badge>{question.domain}</Badge>
        </div>

        {/* Question card */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-jet-black mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button key={i} onClick={() => handleSelect(i)} className={optionClass(i)}>
                <span className="w-5 h-5 rounded-full border-2 border-current shrink-0 flex items-center justify-center">
                  {answered && i === question.correctAnswer && <CheckCircle className="w-4 h-4 text-volt-green" />}
                  {answered && i === selectedAnswer && i !== question.correctAnswer && <XCircle className="w-4 h-4 text-red-400" />}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </Card>

        {/* Explanation */}
        {answered && (
          <div className={`border rounded-xl p-6 mb-6 ${isCorrect ? "border-volt-green bg-white" : "border-red-400 bg-white"}`}>
            <div className="flex items-center gap-2 mb-4">
              {isCorrect ? (
                <Badge variant="success">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Correct</span>
                </Badge>
              ) : (
                <Badge variant="error">
                  <span className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Incorrect</span>
                </Badge>
              )}
              {question.regulation && (
                <span className="text-xs text-slate">{question.regulation}</span>
              )}
            </div>

            <div className="bg-mist-blue rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-jet-black">Correct Answer</p>
              <p className="text-sm text-jet-black">{question.explanation.correct}</p>
            </div>

            <p className="text-sm text-slate mb-4">{question.explanation.reason}</p>

            <div className="bg-volt-mist border-l-4 border-volt-green rounded-r-lg p-4">
              <p className="text-sm font-semibold text-jet-black mb-1">Key Takeaway</p>
              <p className="text-sm text-jet-black">{question.explanation.keyTakeaway}</p>
            </div>

            <div className="mt-6">
              {isLast ? (
                <Button href="/dashboard">Return to Dashboard</Button>
              ) : (
                <Button onClick={handleNext}>Next Question</Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
