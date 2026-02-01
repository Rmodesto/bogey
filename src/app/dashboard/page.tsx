import Link from "next/link";
import {
  Target,
  BookOpen,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

const domains = [
  { name: "Regulations", score: 87, questions: 120 },
  { name: "Airspace Classification", score: 92, questions: 85 },
  { name: "Weather", score: 74, questions: 95 },
  { name: "Loading & Performance", score: 68, questions: 65 },
  { name: "Operations", score: 81, questions: 110 },
];

const focusAreas = [
  { topic: "Weight and Balance Calculations", domain: "Loading & Performance", confidence: 62 },
  { topic: "METAR Interpretation", domain: "Weather", confidence: 68 },
  { topic: "Special Use Airspace", domain: "Airspace Classification", confidence: 71 },
];

const activities = [
  { text: "Completed 25 practice questions", domain: "Regulations", time: "Today" },
  { text: "Finished Weather module", domain: "Weather", time: "Yesterday" },
  { text: "Took practice exam #3", domain: "All Domains", time: "2 days ago" },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-volt-green";
  if (score >= 70) return "text-deep-ice-blue";
  return "text-slate";
}

function dotColor(score: number) {
  if (score >= 80) return "bg-volt-green";
  if (score >= 70) return "bg-deep-ice-blue";
  return "bg-slate";
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-fog-gray">
      <header className="bg-white border-b border-divider-gray px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-slate hover:text-jet-black text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/exam" className="bg-volt-green hover:bg-volt-lime text-jet-black font-semibold px-5 py-2.5 rounded-full text-sm">
            Start Exam
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-semibold text-jet-black mb-1">Training Dashboard</h1>
        <p className="text-slate mb-8">Monitor your progress and identify areas for improvement</p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white border border-divider-gray rounded-xl p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-semibold text-jet-black text-lg">Exam Readiness</h2>
                <p className="text-slate text-sm">Based on your performance across all domains</p>
              </div>
              <Target className="w-6 h-6 text-deep-ice-blue" />
            </div>
            <div className="flex items-center gap-4 mt-4 mb-4">
              <span className="text-7xl font-semibold text-jet-black">80%</span>
              <span className="bg-volt-mist text-volt-lime text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12% this week
              </span>
            </div>
            <div className="w-full bg-mist-blue rounded-full h-3 mb-4">
              <div className="bg-volt-green h-3 rounded-full" style={{ width: "80%" }} />
            </div>
            <p className="text-sm text-slate">
              <span className="font-semibold text-jet-black">Recommendation:</span> Focus on Loading &amp; Performance and Weather domains to increase your readiness score. You&apos;re on track to pass!
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-divider-gray rounded-xl p-6">
              <BookOpen className="w-6 h-6 text-deep-ice-blue mb-3" />
              <p className="text-3xl font-semibold text-jet-black">475</p>
              <p className="text-slate text-sm">Questions Answered</p>
            </div>
            <div className="bg-white border border-divider-gray rounded-xl p-6">
              <Clock className="w-6 h-6 text-deep-ice-blue mb-3" />
              <p className="text-3xl font-semibold text-jet-black">12.5</p>
              <p className="text-slate text-sm">Hours Studied</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-jet-black mb-4">Performance by Domain</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {domains.map((d) => (
            <div key={d.name} className="bg-white border border-divider-gray rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor(d.score)}`} />
                <span className={`text-xl font-semibold ${scoreColor(d.score)}`}>{d.score}%</span>
              </div>
              <p className="font-semibold text-jet-black text-sm">{d.name}</p>
              <p className="text-slate text-xs">{d.questions} questions</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-divider-gray rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-slate" />
              <h2 className="font-semibold text-jet-black text-lg">Focus Areas</h2>
            </div>
            {focusAreas.map((area, i) => (
              <div key={area.topic} className={`py-4 ${i < focusAreas.length - 1 ? "border-b border-divider-gray" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-jet-black text-sm">{area.topic}</p>
                    <p className="text-slate text-xs">{area.domain}</p>
                  </div>
                  <span className="text-slate text-sm">{area.confidence}%</span>
                </div>
                <Link href="/study" className="inline-block mt-2 text-volt-lime text-xs font-semibold border border-volt-green rounded-full px-3 py-1 hover:bg-volt-mist">
                  Practice Now
                </Link>
              </div>
            ))}
          </div>

          <div className="bg-white border border-divider-gray rounded-xl p-6">
            <h2 className="font-semibold text-jet-black text-lg mb-4">Recent Activity</h2>
            <div className="space-y-5">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-deep-ice-blue mt-1 shrink-0" />
                  <div>
                    <p className="text-jet-black text-sm font-medium">{a.text}</p>
                    <p className="text-slate text-xs">{a.domain} &middot; {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-mist-blue rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-jet-black mb-2">Daily Practice Recommended</h2>
          <p className="text-slate mb-4">Consistency is key. Complete 20 questions today to maintain your progress.</p>
          <Link href="/study" className="inline-block bg-volt-green hover:bg-volt-lime text-jet-black font-semibold px-6 py-3 rounded-full">
            Start Daily Practice
          </Link>
        </div>
      </main>
    </div>
  );
}
