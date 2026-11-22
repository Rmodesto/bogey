"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AnnotatedMarkdown from "@/components/AnnotatedMarkdown";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { getModule, getLesson, getAdjacentLessons, queryQuestions } from "@/lib/part107/service";
import Bogeyman from "@/components/Bogeyman";
import { VISUALIZER_REGISTRY } from "@/components/animations/registry";
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
        <p className="text-slate text-[13px]">Lesson not found.</p>
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
      <header className="bg-white border-b border-divider-gray px-[21px] py-[13px]">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <Link
            href="/learn"
            className="flex items-center gap-[8px] text-slate hover:text-jet-black text-[13px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Modules
          </Link>
          <span className="flex items-center gap-[8px] text-[13px] text-slate">
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
              <p className="text-[8px] text-slate uppercase tracking-[0.1em] mb-[8px]">
                {lesson.estimatedMinutes} min &middot; Lesson {lessonIndex + 1}/{totalLessons}
              </p>
              <h2 className="text-[21px] font-semibold text-jet-black mb-[8px]">
                {lesson.title}
              </h2>
              <p className="text-[13px] text-slate leading-[1.8] mb-[21px]">
                {lesson.objectives[0]}
              </p>

              {/* Section list */}
              <div className="space-y-[8px]">
                {sections.map((section, i) => (
                  <button
                    key={section.id}
                    onClick={() => goToSection(i)}
                    className={`w-full text-left px-[13px] py-[8px] rounded-[8px] text-[13px] transition-colors border-l-[3px] ${
                      i === activeSectionIndex
                        ? "border-l-deep-ice-blue bg-volt-mist text-jet-black"
                        : "border-l-transparent text-slate hover:text-jet-black hover:bg-fog-gray"
                    }`}
                  >
                    {i === activeSectionIndex && (
                      <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-deep-ice-blue mb-[2px]">
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
                <p className="text-[13px] text-slate italic mt-[13px] text-center leading-[1.8]">
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
            <h1 className="text-[34px] font-semibold text-jet-black mb-[34px] leading-[1.2]">
              {activeSection.title}
            </h1>

            {/* Section content */}
            <div
              className={[
                "prose max-w-none",
                // Headings — clear section breaks
                "prose-headings:text-jet-black prose-headings:font-semibold",
                "prose-h2:text-[21px] prose-h2:mt-[55px] prose-h2:mb-[13px]",
                "prose-h3:text-[21px] prose-h3:mt-[34px] prose-h3:mb-[13px]",
                // Visual divider above h2 sections (except first child)
                "[&>h2:not(:first-child)]:pt-[21px] [&>h2:not(:first-child)]:border-t [&>h2:not(:first-child)]:border-divider-gray",
                // Body — graphite for WCAG AA compliance
                "prose-p:text-graphite prose-p:text-[13px] prose-p:leading-[1.8] prose-p:mb-[21px]",
                "prose-strong:text-jet-black",
                // Lists — generous spacing for visual grouping
                "prose-ul:my-[34px] prose-ol:my-[34px]",
                "prose-li:text-graphite prose-li:text-[13px] prose-li:leading-[1.8] prose-li:my-[13px]",
                // Blockquotes — callout card treatment
                "prose-blockquote:border-l-deep-ice-blue prose-blockquote:bg-mist-blue prose-blockquote:rounded-r-[8px]",
                "prose-blockquote:py-[13px] prose-blockquote:px-[21px] prose-blockquote:my-[34px]",
                "prose-blockquote:not-italic prose-blockquote:text-graphite prose-blockquote:text-[13px]",
                // Tables
                "prose-table:text-[13px] prose-table:my-[34px]",
                // Links
                "prose-a:text-deep-ice-blue prose-a:no-underline hover:prose-a:underline",
              ].join(" ")}
            >
              <AnnotatedMarkdown content={activeSection.content} />
            </div>

            {/* Visualizers — a section may carry one or several */}
            {[...(activeSection.visualizer ? [activeSection.visualizer] : []), ...(activeSection.visualizers ?? [])].map(
              (viz, i) => {
                const Visualizer = VISUALIZER_REGISTRY[viz.type];
                return Visualizer ? (
                  <div key={`${viz.type}-${i}`} className="mt-[34px]">
                    <Visualizer />
                  </div>
                ) : null;
              }
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
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-[13px]"
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
                  className="bg-volt-green text-jet-black text-[13px] font-semibold px-[21px] py-[8px] rounded-full hover:bg-volt-lime transition-colors"
                >
                  Continue
                </button>
              ) : next ? (
                <Link
                  href={`/learn/${moduleId}/${next.id}`}
                  className="bg-volt-green text-jet-black text-[13px] font-semibold px-[21px] py-[8px] rounded-full hover:bg-volt-lime transition-colors"
                >
                  Next Lesson
                </Link>
              ) : (
                <Link
                  href="/learn"
                  className="bg-volt-green text-jet-black text-[13px] font-semibold px-[21px] py-[8px] rounded-full hover:bg-volt-lime transition-colors"
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
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-[13px]"
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
                  className="flex items-center gap-[8px] text-slate hover:text-jet-black text-[13px]"
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
            <p className="text-[13px] text-slate italic leading-[1.8]">
              {activeBogey.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
