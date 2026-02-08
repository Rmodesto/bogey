"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Menu, X } from "lucide-react";
import Bogeyman from "./Bogeyman";
import ProgressBar from "./ProgressBar";

type Mood = "neutral" | "happy" | "warning" | "celebrating";

interface SectionItem {
  id: string;
  title: string;
  status: "upcoming" | "active" | "complete";
}

export default function LessonSidebar({
  moduleTitle,
  lessonTitle,
  sections,
  activeSectionId,
  progress,
  bogeymanMood,
  bogeymanMessage,
  onSectionClick,
}: {
  moduleTitle: string;
  lessonTitle: string;
  sections: SectionItem[];
  activeSectionId: string;
  progress: number;
  bogeymanMood?: Mood;
  bogeymanMessage?: string;
  onSectionClick?: (sectionId: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const statusDot = (status: SectionItem["status"]) => {
    switch (status) {
      case "complete":
        return "bg-volt-green";
      case "active":
        return "bg-ice-blue";
      default:
        return "bg-divider-gray";
    }
  };

  const sidebar = (
    <div className="w-[382px] min-h-screen bg-white border-r border-divider-gray p-[34px] flex flex-col">
      <Link
        href="/learn"
        className="flex items-center gap-[8px] text-slate hover:text-jet-black text-sm mb-[34px]"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Modules
      </Link>

      <div className="flex justify-center mb-[21px] scale-75 origin-top">
        <Bogeyman mood={bogeymanMood} message={bogeymanMessage} talking={!!bogeymanMessage} />
      </div>

      <p className="text-xs text-slate mb-[4px]">{moduleTitle}</p>
      <h2 className="text-lg font-semibold text-jet-black mb-[21px]">{lessonTitle}</h2>

      <nav className="flex-1 space-y-[4px]">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionClick?.(section.id)}
            className={`flex items-center gap-[8px] w-full text-left text-sm p-[8px] rounded-[8px] transition-colors ${
              section.id === activeSectionId
                ? "bg-mist-blue text-jet-black font-medium"
                : "text-slate hover:text-jet-black"
            }`}
          >
            <span className={`w-[8px] h-[8px] rounded-full shrink-0 ${statusDot(section.status)}`} />
            {section.title}
          </button>
        ))}
      </nav>

      <div className="mt-[34px]">
        <ProgressBar value={progress} containerClass="bg-divider-gray rounded-full h-[5px]" />
        <p className="text-xs text-slate mt-[8px]">{Math.round(progress)}% complete</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 z-40">{sidebar}</div>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-divider-gray rounded-[8px] p-[8px] shadow-sm"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 z-50 overflow-y-auto">{sidebar}</div>
        </>
      )}
    </>
  );
}
