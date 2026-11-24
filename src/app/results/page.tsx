import { getActiveBank, getActiveBlueprintData } from "@/lib/part107/compat";
import ResultsClient from "./ResultsClient";

// Server component: provides the bank and blueprint so the client island can
// regenerate the graded exam from the seed carried in the URL.
export default function ResultsPage() {
  return <ResultsClient bank={getActiveBank()} blueprint={getActiveBlueprintData()} />;
}
