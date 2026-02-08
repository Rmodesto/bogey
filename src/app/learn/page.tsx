import Link from "next/link";
import { listModules } from "@/lib/part107/service";
import PageHeader from "@/components/PageHeader";
import ProgressBar from "@/components/ProgressBar";
import {
  Scale,
  Cloud,
  BookOpen,
  Gauge,
  Radio,
  CheckCircle2,
  Play,
  Lock,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Scale, Cloud, BookOpen, Gauge, Radio };

type LessonStatus = "completed" | "available" | "locked";

function getLessonStatus(_lessonIndex: number, _completedCount: number): LessonStatus {
  // First lesson of each module is available, rest are locked (no progress tracking yet)
  if (_lessonIndex < _completedCount) return "completed";
  if (_lessonIndex === _completedCount) return "available";
  return "locked";
}

export default function LearnHub() {
  const modules = listModules();

  return (
    <div className="min-h-screen bg-fog-gray">
      <PageHeader backHref="/dashboard" backLabel="Back to Dashboard" />

      <main className="max-w-[1100px] mx-auto px-[34px] md:px-[55px] py-[55px]">
        <h1 className="text-[32px] font-semibold text-jet-black mb-[8px]">
          Part 107 Learning Path
        </h1>
        <p className="text-slate mb-[55px] max-w-[700px] leading-relaxed">
          Master drone regulations through interactive lessons with the Bogeyman guide.
          Complete lessons in sequence to unlock advanced topics.
        </p>

        <div className="space-y-[34px]">
          {modules.map((mod) => {
            const Icon = iconMap[mod.icon] ?? BookOpen;
            const completedCount = 0; // No progress tracking yet
            const total = mod.lessons.length;
            const progress = total > 0 ? (completedCount / total) * 100 : 0;

            return (
              <div
                key={mod.id}
                className="bg-white border border-divider-gray rounded-[13px] p-[34px]"
              >
                {/* Module header */}
                <div className="flex items-start justify-between mb-[21px]">
                  <div className="flex items-start gap-[13px]">
                    <div className="w-[44px] h-[44px] bg-mist-blue rounded-[8px] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-deep-ice-blue" />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-semibold text-jet-black">
                        {mod.title}
                      </h2>
                      <p className="text-sm text-slate mt-[2px]">{mod.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-[21px]">
                    <p className="text-[36px] font-semibold text-jet-black leading-none">
                      {completedCount}/{total}
                    </p>
                    <p className="text-xs text-slate mt-[4px]">lessons completed</p>
                  </div>
                </div>

                {/* Progress bar */}
                <ProgressBar
                  value={progress}
                  containerClass="bg-divider-gray rounded-full h-[6px] mb-[21px]"
                />

                {/* Lesson rows */}
                <div className="space-y-[8px]">
                  {mod.lessons.map((lesson, lessonIndex) => {
                    const status = getLessonStatus(lessonIndex, completedCount);
                    const isCompleted = status === "completed";
                    const isAvailable = status === "available";
                    const isLocked = status === "locked";

                    const rowBg = isCompleted
                      ? "bg-volt-mist border-volt-green/40"
                      : "bg-white border-divider-gray";

                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-[13px] p-[16px] border rounded-[8px] ${rowBg}`}
                      >
                        {/* Status icon */}
                        <div
                          className={`w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-volt-green"
                              : isAvailable
                              ? "bg-mist-blue"
                              : "bg-divider-gray"
                          }`}
                        >
                          {isCompleted && (
                            <CheckCircle2 className="w-[18px] h-[18px] text-white" />
                          )}
                          {isAvailable && (
                            <Play className="w-[14px] h-[14px] text-deep-ice-blue ml-[2px]" />
                          )}
                          {isLocked && (
                            <Lock className="w-[14px] h-[14px] text-slate" />
                          )}
                        </div>

                        {/* Lesson info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold text-sm ${
                              isLocked ? "text-slate/60" : "text-jet-black"
                            }`}
                          >
                            {lesson.title}
                          </p>
                          <p className={`text-xs ${isLocked ? "text-slate/40" : "text-slate"}`}>
                            {lesson.estimatedMinutes} min
                          </p>
                        </div>

                        {/* Start button */}
                        {isAvailable && (
                          <Link
                            href={`/learn/${mod.id}/${lesson.id}`}
                            className="bg-deep-ice-blue text-white text-xs font-semibold px-[16px] py-[6px] rounded-full hover:bg-ice-blue transition-colors shrink-0"
                          >
                            Start
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
