import {
  Plane,
  TrendingUp,
  CheckCircle,
  Shield,
  Brain,
  Timer,
  BookOpen,
  BarChart3,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import Card from "@/components/Card";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

const stats = [
  { value: "94%", label: "Pass Rate", icon: TrendingUp },
  { value: "12,400+", label: "Pilots Certified", icon: CheckCircle },
  { value: "FAA", label: "Approved Content", icon: Shield },
];

const features = [
  {
    title: "Adaptive Learning",
    description:
      "Our system identifies weak areas and creates personalized study plans to target your knowledge gaps.",
    icon: Brain,
  },
  {
    title: "Real Exam Simulation",
    description:
      "Practice with a timer and question format that matches the actual FAA Part 107 exam experience.",
    icon: Timer,
  },
  {
    title: "Detailed Explanations",
    description:
      "Every question includes comprehensive explanations with visual aids and regulation references.",
    icon: BookOpen,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your readiness across all exam domains with detailed analytics and performance insights.",
    icon: BarChart3,
  },
  {
    title: "Mobile & Desktop",
    description:
      "Study anywhere on your mobile device, but take practice exams on desktop for the best experience.",
    icon: Smartphone,
  },
  {
    title: "Up-to-Date Content",
    description:
      "All questions and materials are regularly updated to reflect current FAA regulations and standards.",
    icon: RefreshCw,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-divider-gray bg-white max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Plane className="w-6 h-6 text-deep-ice-blue" />
          <span className="font-semibold text-lg text-jet-black">
            BogeyMan
          </span>
        </div>
        <Button href="/dashboard" className="px-5 py-2.5">
          Start Training
        </Button>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge>FAA-Approved Curriculum</Badge>
            <h1 className="text-5xl font-semibold text-jet-black leading-tight mb-4 mt-6">
              Pass Your Part 107 Drone Exam
            </h1>
            <p className="text-lg text-slate mb-8 leading-relaxed">
              Aviation-grade training platform designed for commercial drone
              pilots. Study with precision, simulate real exam conditions, and
              earn your certification with confidence.
            </p>
            <div className="flex gap-4">
              <Button href="/study">Start Free Training</Button>
              <Button href="/exam" variant="outline">Try Exam Simulator</Button>
            </div>
          </div>
          <div className="bg-mist-blue rounded-xl p-8 flex items-center justify-center min-h-[300px]">
            <div className="text-center text-deep-ice-blue">
              <Plane className="w-24 h-24 mx-auto mb-4 opacity-40" />
              <p className="text-sm opacity-60">Aviation Training Platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} icon={stat.icon} value={stat.value} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-fog-gray py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-jet-black text-center mb-2">
            Professional-Grade Training
          </h2>
          <p className="text-slate text-center mb-12">
            Everything you need to prepare for FAA Part 107 certification
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-md">
                <div className="w-10 h-10 bg-mist-blue rounded-lg flex items-center justify-center mb-4">
                  <div className="w-2 h-2 bg-deep-ice-blue rounded-full" />
                </div>
                <h3 className="font-semibold text-jet-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-mist-blue rounded-2xl p-16 text-center">
          <h2 className="text-3xl font-semibold text-jet-black mb-4">
            Ready to Get Certified?
          </h2>
          <p className="text-slate mb-8 max-w-xl mx-auto">
            Join thousands of professional drone pilots who trusted our platform
            to pass their Part 107 exam on the first try.
          </p>
          <Button href="/study" className="px-8 py-3.5">
            Begin Training Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-divider-gray py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-deep-ice-blue" />
            <span className="font-semibold text-jet-black">BogeyMan</span>
          </div>
          <p className="text-slate text-sm">
            &copy; 2026 BogeyMan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
