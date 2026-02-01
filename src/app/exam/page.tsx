"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Grid3X3, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { examQuestions } from "@/data/questions";

function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function ExamSimulator() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(examQuestions.length).fill(null)
  );
  const [flagged, setFlagged] = useState<boolean[]>(
    () => new Array(examQuestions.length).fill(false)
  );
  const [timeRemaining, setTimeRemaining] = useState(7200);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const submitExam = useCallback(() => {
    const score = answers.reduce(
      (acc: number, a, i) => acc + (a === examQuestions[i].correctAnswer ? 1 : 0),
      0
    );
    const params = new URLSearchParams({
      score: String(score),
      total: String(examQuestions.length),
      time: String(7200 - timeRemaining),
      answers: JSON.stringify(answers),
    });
    router.push(`/results?${params.toString()}`);
  }, [answers, timeRemaining, router]);

  useEffect(() => {
    if (started && timeRemaining === 0) submitExam();
  }, [started, timeRemaining, submitExam]);

  const question = examQuestions[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;
  const flaggedCount = flagged.filter(Boolean).length;

  if (!started) {
    return (
      <div className="min-h-screen bg-jet-black flex items-center justify-center">
        <div className="bg-graphite border border-slate/30 rounded-2xl p-10 max-w-lg w-full text-center">
          <h1 className="text-3xl font-semibold text-white mb-3">Part 107 Practice Exam</h1>
          <p className="text-slate text-sm mb-8">
            This practice exam simulates the actual FAA Part 107 exam experience. You have 2 hours to answer {examQuestions.length} questions. Once started, the timer cannot be paused.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {[
              { value: String(examQuestions.length), label: "Questions" },
              { value: "120 min", label: "Time Limit" },
              { value: "70%", label: "Passing Score" },
            ].map((s) => (
              <div key={s.label} className="bg-jet-black border border-slate/40 rounded-xl px-6 py-4 min-w-[100px]">
                <p className="text-xl font-semibold text-ice-blue">{s.value}</p>
                <p className="text-slate text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => setStarted(true)} className="bg-volt-green hover:bg-volt-lime text-jet-black font-semibold px-8 py-3 rounded-full">
              Begin Exam
            </button>
            <Link href="/dashboard" className="text-slate hover:text-white font-semibold px-6 py-3 rounded-full border border-slate/40">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jet-black text-white">
      {/* Exam header */}
      <header className="border-b border-slate/30 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-slate">
            <span>Question {currentIndex + 1} of {examQuestions.length}</span>
            <span className="border-l border-slate/30 pl-6">Answered: {answeredCount}/{examQuestions.length}</span>
            {flaggedCount > 0 && <span className="text-volt-green">Flagged: {flaggedCount}</span>}
          </div>
          <div className="flex items-center gap-4">
            <span className={`flex items-center gap-2 font-mono text-sm ${timeRemaining < 600 ? "text-red-400" : "text-ice-blue"}`}>
              <Clock className="w-4 h-4" /> {formatTime(timeRemaining)}
            </span>
            <button onClick={() => setShowNav(!showNav)} className="p-2 rounded-lg border border-slate/40 hover:bg-graphite">
              <Grid3X3 className="w-5 h-5 text-slate" />
            </button>
          </div>
        </div>
      </header>

      {/* Question navigator overlay */}
      {showNav && (
        <div className="border-b border-slate/30 bg-graphite px-6 py-4">
          <div className="max-w-5xl mx-auto grid grid-cols-10 gap-2">
            {examQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setShowNav(false); }}
                className={`relative w-full aspect-square rounded-lg text-xs font-semibold flex items-center justify-center border ${
                  i === currentIndex
                    ? "bg-deep-ice-blue border-deep-ice-blue text-white"
                    : answers[i] !== null
                    ? "bg-volt-green border-volt-green text-jet-black"
                    : "bg-jet-black border-slate/40 text-slate"
                } ${flagged[i] ? "ring-2 ring-volt-green" : ""}`}
              >
                {i + 1}
                {flagged[i] && <Flag className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-volt-green" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-graphite border border-slate/30 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-slate/20 text-ice-blue text-xs font-semibold px-3 py-1.5 rounded-lg">
              {question.domain}
            </span>
            <button
              onClick={() => {
                const f = [...flagged];
                f[currentIndex] = !f[currentIndex];
                setFlagged(f);
              }}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border ${
                flagged[currentIndex]
                  ? "border-volt-green text-volt-green"
                  : "border-slate/40 text-slate hover:text-white"
              }`}
            >
              <Flag className="w-4 h-4" /> Flag
            </button>
          </div>

          <h2 className="text-xl font-semibold text-white mb-8">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  const a = [...answers];
                  a[currentIndex] = i;
                  setAnswers(a);
                }}
                className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 text-sm ${
                  answers[currentIndex] === i
                    ? "border-ice-blue bg-ice-blue/10 text-white"
                    : "border-slate/30 bg-jet-black text-slate hover:text-white hover:border-slate"
                }`}
              >
                <span className="w-5 h-5 rounded-full border-2 border-current shrink-0" />
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-sm text-slate hover:text-white disabled:opacity-30 px-4 py-2.5 rounded-lg border border-slate/30"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {currentIndex === examQuestions.length - 1 ? (
            <button onClick={submitExam} className="bg-volt-green hover:bg-volt-lime text-jet-black font-semibold px-6 py-2.5 rounded-full text-sm">
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex items-center gap-2 text-sm bg-ice-blue/20 text-ice-blue hover:bg-ice-blue/30 px-4 py-2.5 rounded-lg"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
