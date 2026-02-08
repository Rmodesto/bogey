import Link from "next/link";
import { Scale, Cloud, BookOpen, Gauge, Radio, Clock, type LucideIcon } from "lucide-react";
import ProgressBar from "./ProgressBar";

const iconMap: Record<string, LucideIcon> = { Scale, Cloud, BookOpen, Gauge, Radio };

export default function ModuleCard({
  id,
  title,
  description,
  icon,
  estimatedHours,
  lessonCount,
  progress,
  firstLessonId,
}: {
  id: string;
  title: string;
  description: string;
  icon: string;
  estimatedHours: number;
  lessonCount: number;
  progress: number;
  firstLessonId: string;
}) {
  const Icon = iconMap[icon] ?? BookOpen;

  return (
    <Link
      href={`/learn/${id}/${firstLessonId}`}
      className="block w-[377px] max-w-full p-[34px] rounded-[13px] bg-white border border-divider-gray hover:border-ice-blue hover:-translate-y-[3px] hover:shadow-lg transition-all duration-[233ms]"
    >
      <div className="w-[55px] h-[55px] bg-mist-blue rounded-[13px] flex items-center justify-center mb-[21px]">
        <Icon className="w-6 h-6 text-deep-ice-blue" />
      </div>
      <h3 className="text-lg font-semibold text-jet-black mb-[8px]">{title}</h3>
      <p className="text-sm text-slate mb-[21px] leading-relaxed">{description}</p>
      <ProgressBar value={progress} containerClass="bg-divider-gray rounded-full h-[5px] mb-[13px]" />
      <div className="flex items-center justify-between text-xs text-slate">
        <span>{lessonCount} lessons</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {estimatedHours}h
        </span>
      </div>
    </Link>
  );
}
