import { getStudyQuestions } from "@/lib/part107/compat";
import StudyClient from "./StudyClient";

// Server component: reads the bank on the server and passes the study slice
// down, so the generated JSON never enters the client bundle.
export default function StudyPage() {
  return <StudyClient questions={getStudyQuestions()} />;
}
