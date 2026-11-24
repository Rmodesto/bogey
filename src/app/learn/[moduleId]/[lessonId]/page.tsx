import { notFound } from "next/navigation";
import AnnotatedMarkdown from "@/components/AnnotatedMarkdown";
import { getModule, getLesson, getAdjacentLessons, queryQuestions, listModules } from "@/lib/part107/service";
import LessonView from "./LessonView";

// Server component: every lesson is prerendered at build time. Content is
// read here, each section's markdown is rendered to React nodes on the
// server, and only the data this lesson needs crosses to the client island.

export const dynamicParams = false;

export function generateStaticParams() {
  return listModules().flatMap((mod) =>
    mod.lessons.map((lesson) => ({ moduleId: mod.id, lessonId: lesson.id }))
  );
}

export default function LessonPage({
  params,
}: {
  params: { moduleId: string; lessonId: string };
}) {
  const { moduleId, lessonId } = params;
  const mod = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);
  if (!mod || !lesson) notFound();

  const { prev, next } = getAdjacentLessons(moduleId, lessonId);
  const questions = queryQuestions({ moduleId, lessonId });
  const lessonIndex = mod.lessons.findIndex((l) => l.id === lessonId);

  return (
    <LessonView
      key={lessonId}
      moduleId={moduleId}
      lesson={{
        title: lesson.title,
        estimatedMinutes: lesson.estimatedMinutes,
        objectives: lesson.objectives,
      }}
      sections={lesson.sections.map(({ id, title, visualizer, visualizers, bogeyman }) => ({
        id,
        title,
        visualizer,
        visualizers,
        bogeyman,
      }))}
      sectionBodies={lesson.sections.map((section) => (
        <AnnotatedMarkdown key={section.id} content={section.content} />
      ))}
      lessonIndex={lessonIndex}
      totalLessons={mod.lessons.length}
      prev={prev ? { id: prev.id, title: prev.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
      questions={questions}
    />
  );
}
