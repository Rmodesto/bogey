import { getActiveBank, getActiveBlueprintData } from "@/lib/part107/compat";
import ExamClient from "./ExamClient";

// Server component: hands the active bank and blueprint to the client island,
// which draws a fresh seeded exam per attempt. The generated JSON stays out
// of the shared client bundle; only this route's payload carries the bank.
export default function ExamPage() {
  return <ExamClient bank={getActiveBank()} blueprint={getActiveBlueprintData()} />;
}
