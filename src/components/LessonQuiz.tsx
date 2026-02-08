"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, XCircle } from "lucide-react";
import Bogeyman from "./Bogeyman";
import ProgressBar from "./ProgressBar";

interface QuizQuestion {
  id: string;
  stem: string;
  choices: { id: string; text: string; isCorrect: boolean }[];
  explanation: {
    correct: string;
    reason: string;
    keyTakeaway: string;
    references: string[];
  };
}

export default function LessonQuiz({
  questions,
  onComplete,
  showBogeyman = false,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  showBogeyman?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;

  const q = questions[current];
  const correctChoice = q.choices.find((c) => c.isCorrect);
  const isCorrect = selected === correctChoice?.id;

  function handleSelect(choiceId: string) {
    if (answered) return;
    setSelected(choiceId);
    setAnswered(true);
    if (q.choices.find((c) => c.id === choiceId)?.isCorrect) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (current === questions.length - 1) {
      const finalScore = Math.round((score / questions.length) * 100);
      setFinished(true);
      onComplete(finalScore);
      return;
    }
    setCurrent((i) => i + 1);
    setSelected(null);
    setAnswered(false);
  }

  function choiceClass(choiceId: string) {
    const base = "border-2 rounded-[8px] p-[13px] w-full text-left flex items-center gap-[13px]";
    if (!answered) {
      if (selected === choiceId) return `${base} border-ice-blue bg-mist-blue`;
      return `${base} border-divider-gray hover:border-slate`;
    }
    const choice = q.choices.find((c) => c.id === choiceId);
    if (choice?.isCorrect) return `${base} border-volt-green bg-volt-mist`;
    if (choiceId === selected) return `${base} border-red-400 bg-red-50`;
    return `${base} border-divider-gray text-slate`;
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-[610px] w-full bg-mist-blue border-2 border-ice-blue rounded-[13px] p-[34px] text-center">
        <h3 className="text-xl font-semibold text-jet-black mb-[8px]">Quiz Complete</h3>
        <p className="text-4xl font-bold text-jet-black mb-[13px]">{pct}%</p>
        <p className="text-sm text-slate">
          You got {score} out of {questions.length} correct
        </p>
      </div>
    );
  }

  const bogeyMood = !answered ? "neutral" : isCorrect ? "celebrating" : "warning";

  return (
    <div className="flex gap-[34px] items-start">
      <div className="max-w-[610px] w-full bg-mist-blue border-2 border-ice-blue rounded-[13px] p-[34px]">
        <div className="flex items-center justify-between mb-[13px]">
          <h3 className="font-semibold text-jet-black">Knowledge Check</h3>
          <span className="text-sm text-slate">
            {current + 1} / {questions.length}
          </span>
        </div>

        <ProgressBar
          value={((current + (answered ? 1 : 0)) / questions.length) * 100}
          containerClass="bg-divider-gray rounded-full h-[5px] mb-[21px]"
          barClass="bg-ice-blue"
        />

        <p className="text-[16px] leading-[1.618] font-medium text-jet-black mb-[21px]">
          {q.stem}
        </p>

        <div className="space-y-[13px] mb-[21px]">
          {q.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleSelect(choice.id)}
              className={choiceClass(choice.id)}
            >
              <span
                className={`w-[21px] h-[21px] rounded-full border-2 shrink-0 flex items-center justify-center ${
                  answered && choice.isCorrect
                    ? "border-volt-green"
                    : answered && choice.id === selected
                    ? "border-red-400"
                    : "border-slate"
                }`}
              >
                {answered && choice.isCorrect && <CheckCircle className="w-4 h-4 text-volt-green" />}
                {answered && choice.id === selected && !choice.isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </span>
              <span className="text-sm">{choice.text}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`border-l-4 ${isCorrect ? "border-volt-green" : "border-red-400"} rounded-r-[8px] p-[13px] bg-white mb-[21px]`}
            >
              <p className="text-sm font-semibold text-jet-black mb-[4px]">
                {isCorrect ? "Correct!" : "Not quite"}
              </p>
              <p className="text-sm text-slate mb-[8px]">{q.explanation.reason}</p>
              <div className="bg-volt-mist border-l-4 border-volt-green rounded-r-[4px] p-[8px]">
                <p className="text-xs font-semibold text-jet-black">Key Takeaway</p>
                <p className="text-xs text-jet-black">{q.explanation.keyTakeaway}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {answered && (
          <button
            onClick={handleNext}
            className="bg-volt-green rounded-[8px] p-[13px] w-full font-medium text-jet-black hover:bg-volt-lime transition-colors"
          >
            {current === questions.length - 1 ? "See Results" : "Next Question"}
          </button>
        )}
      </div>

      {showBogeyman && (
        <div className="hidden lg:block shrink-0">
          <Bogeyman
            mood={bogeyMood}
            talking={answered}
            message={
              answered
                ? isCorrect
                  ? "Great job! You nailed it!"
                  : "Don't worry — review the explanation and you'll get it next time."
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
