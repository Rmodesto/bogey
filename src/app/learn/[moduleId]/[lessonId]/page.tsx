"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getModule, getLesson, getAdjacentLessons, queryQuestions } from "@/lib/part107/service";
import Bogeyman from "@/components/Bogeyman";
import AirspaceVisualizer from "@/components/AirspaceVisualizer";
import METARDecoder from "@/components/METARDecoder";
import LessonQuiz from "@/components/LessonQuiz";

export default function LessonViewer() {
  const params = useParams<{ moduleId: string; lessonId: string }>();
  const { moduleId, lessonId } = params;

  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const { prev, next } = getAdjacentLessons(moduleId, lessonId);
  const questions = queryQuestions({ moduleId, lessonId });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    setActiveSectionIndex(0);
  }, [lessonId]);

  if (!mod || !lesson) {
    return (
      <div className="min-h-screen bg-fog-gray flex items-center justify-center">
        <p className="text-slate">Lesson not found.</p>
      </div>
    );
  }

  const sections = lesson.sections;
  const activeSection = sections[activeSectionIndex];
  const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId);
  const totalLessons = mod.lessons.length;
  const sectionProgress =
    sections.length > 0 ? ((activeSectionIndex + 1) / sections.length) * 100 : 0;

  const activeBogey = activeSection?.bogeyman;
  const isLastSection = activeSectionIndex === sections.length - 1;
  const showQuiz = isLastSection && questions.length > 0;

  function goToSection(index: number) {
    setActiveSectionIndex(Math.max(0, Math.min(index, sections.length - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-fog-gray">
      {/* Header */}
      <header className="bg-white border-b border-divider-gray px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link
            href="/learn"
            className="flex items-center gap-2 text-slate hover:text-jet-black text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Link>
          <span className="flex items-center gap-2 text-sm text-slate">
            <BookOpen className="w-4 h-4" />
            Section {activeSectionIndex + 1} of {sections.length}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-[3px] bg-divider-gray">
        <div
          className="h-full bg-volt-green transition-all duration-300"
          style={{ width: `${sectionProgress}%` }}
        />
      </div>

      {/* Two-column layout */}
      <main className="max-w-[1200px] mx-auto flex gap-[34px] px-[34px] md:px-[55px] py-[55px]">
        {/* Left column — sticky */}
        <div className="w-[380px] shrink-0 hidden lg:block">
          <div className="sticky top-[34px] space-y-[21px]">
            {/* Lesson info card */}
            <div className="bg-white border border-divider-gray rounded-[13px] p-[34px]">
              <p className="text-xs text-slate uppercase tracking-wider mb-[13px]">
                {lesson.estimatedMinutes} min &middot; Lesson {lessonIndex + 1}/{totalLessons}
              </p>
              <h2 className="text-[22px] font-semibold text-jet-black mb-[8px]">
                {lesson.title}
              </h2>
              <p className="text-sm text-slate leading-relaxed mb-[21px]">
                {lesson.objectives[0]}
              </p>

              {/* Section list */}
              <div className="space-y-[4px]">
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(i)}
                    className={`w-full text-left px-[13px] py-[8px] rounded-[8px] text-sm transition-colors ${
                      i === activeSectionIndex
                        ? "bg-volt-mist text-jet-black"
                        : "text-slate hover:text-jet-black hover:bg-fog-gray"
                    }`}
                  >
                    {i === activeSectionIndex && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-jet-black mb-[2px]">
                        Current Section
                      </p>
                    )}
                    <span className={i === activeSectionIndex ? "font-medium" : ""}>
                      {section.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bogeyman card */}
            <div className="bg-white border border-divider-gray rounded-[13px] p-[34px] flex flex-col items-center">
              <Bogeyman
                mood={activeBogey?.mood ?? "neutral"}
                message={activeBogey?.message}
                talking={!!activeBogey?.message}
              />
              {activeBogey?.message && (
                <p className="text-sm text-slate italic mt-[13px] text-center leading-relaxed">
                  &ldquo;{activeBogey.message}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column — content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-divider-gray rounded-[13px] p-[34px] md:p-[55px]">
            {/* Section title */}
            <h1 className="text-[28px] font-semibold text-jet-black mb-[34px]">
              {activeSection.title}
            </h1>

            {/* Section content */}
            <div className="prose prose-sm max-w-none prose-headings:text-jet-black prose-p:text-slate prose-strong:text-jet-black prose-li:text-slate prose-p:leading-[1.8] prose-li:leading-[1.8] prose-table:text-sm">
              <ReactMarkdown>{activeSection.content}</ReactMarkdown>
            </div>

            {/* Visualizer */}
            {activeSection.visualizer?.type === "airspace" && (
              <div className="mt-[34px]">
                <AirspaceVisualizer />
              </div>
            )}

            {activeSection.visualizer?.type === "metar" && (
              <div className="mt-[34px]">
                <METARDecoder metarString="KMCO 121853Z 09008KT 10SM -RA SCT025 BKN040 18/14 A2990" />
              </div>
            )}

            {/* Quiz on last section */}
            {showQuiz && (
              <div className="mt-[55px] pt-[34px] border-t border-divider-gray">
                <LessonQuiz
                  questions={questions}
                  onComplete={(score) => console.log("Quiz score:", score)}
                  showBogeyman={false}
                />
              </div>
            )}

            {/* Section navigation */}
            <div className="flex items-center justify-between mt-[55px] pt-[21px] border-t border-divider-gray">
              {activeSectionIndex > 0 ? (
                <button
                  onClick={() => goToSection(activeSectionIndex - 1)}
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div />
              )}

              {!isLastSection ? (
                <button
                  onClick={() => goToSection(activeSectionIndex + 1)}
                  className="bg-volt-green text-jet-black text-sm font-semibold px-[21px] py-[10px] rounded-full hover:bg-volt-lime transition-colors"
                >
                  Continue
                </button>
              ) : next ? (
                <Link
                  href={`/learn/${moduleId}/${next.id}`}
                  className="bg-volt-green text-jet-black text-sm font-semibold px-[21px] py-[10px] rounded-full hover:bg-volt-lime transition-colors"
                >
                  Next Lesson
                </Link>
              ) : (
                <Link
                  href="/learn"
                  className="bg-volt-green text-jet-black text-sm font-semibold px-[21px] py-[10px] rounded-full hover:bg-volt-lime transition-colors"
                >
                  Back to Modules
                </Link>
              )}
            </div>
          </div>

          {/* Prev/next lesson nav below the card */}
          {(prev || next) && (
            <div className="flex items-center justify-between mt-[21px] px-[8px]">
              {prev ? (
                <Link
                  href={`/learn/${moduleId}/${prev.id}`}
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {prev.title}
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/learn/${moduleId}/${next.id}`}
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-sm"
                >
                  {next.title}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {/* Mobile: bogeyman message inline (visible only on small screens) */}
      {activeBogey?.message && (
        <div className="lg:hidden px-[34px] pb-[34px]">
          <div className="bg-white border border-divider-gray rounded-[13px] p-[21px] flex items-start gap-[13px]">
            <div className="w-[34px] h-[34px] bg-mist-blue rounded-full flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-deep-ice-blue" />
            </div>
            <p className="text-sm text-slate italic leading-relaxed">
              {activeBogey.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
