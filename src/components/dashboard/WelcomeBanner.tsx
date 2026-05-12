import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  BookMarked,
  Globe2,
  PlaneTakeoff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  counselorName: string;
  stats: {
    totalStudents: number;
    activeApplications: number;
    pendingReviews: number;
    completedCases: number;
  };
}

const toStatItems = (stats: WelcomeBannerProps["stats"]) => [
  { label: "Total Students", value: String(stats.totalStudents), icon: Users },
  {
    label: "Active Applications",
    value: String(stats.activeApplications),
    icon: FileText,
  },
  {
    label: "Pending Reviews",
    value: String(stats.pendingReviews),
    icon: Clock,
  },
  {
    label: "Completed Cases",
    value: String(stats.completedCases),
    icon: CheckCircle2,
  },
];

const WelcomeBanner = ({ counselorName, stats }: WelcomeBannerProps) => {
  const items = toStatItems(stats);

  return (
    <section className="rounded-3xl gradient-hero hero-pattern p-6 md:p-9 text-white shadow-card overflow-hidden relative">
      <div className="absolute inset-0 bg-slate-950/30" />
      <div className="absolute -left-6 top-4 h-20 w-20 rounded-full bg-white/20 blur-xl" />
      <div className="absolute right-16 -bottom-10 h-32 w-32 rounded-full bg-white/15 blur-xl" />

      <div className="relative z-10 grid lg:grid-cols-[1.4fr_1fr] gap-7 items-center">
        <div className="space-y-5 animate-slide-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/35 px-3 py-1 text-xs font-semibold bg-white/15">
            <BookMarked className="h-3.5 w-3.5" />
            Study Abroad Command Center
          </span>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 leading-tight">
              Welcome back, {counselorName}
            </h1>
            <p className="text-white text-sm md:text-base max-w-xl">
              Guide students from profile to visa approval with a modern, visual
              workflow built for international admissions.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              variant="secondary"
              className="bg-white/95 text-primary hover:bg-white"
            >
              <Globe2 className="h-4 w-4" />
              Explore Destinations
            </Button>
            <Button
              variant="outline"
              className="border-white/55 bg-white/15 text-white hover:bg-white/25"
            >
              <PlaneTakeoff className="h-4 w-4" />
              Plan Student Journeys
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/25 rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 border border-white/35"
              >
                <stat.icon className="h-5 w-5 text-white" />
                <span className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </span>
                <span className="text-xs text-white/95 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative animate-fade-in">
          <div className="relative h-56 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-xl border border-white/35">
            <img
              src="/dashboard-hero.jpg"
              alt="Students with study abroad documents"
              className="h-full w-full object-cover"
              decoding="async"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/15 to-transparent" />
            <div className="absolute left-4 right-4 bottom-4 space-y-1">
              <p className="text-sm font-semibold text-white">
                International Admissions Spotlight
              </p>
              <p className="text-xs text-white/90">
                Using `public/dashboard-hero.jpg`
              </p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-3 rounded-xl bg-white/90 text-primary px-3 py-2 shadow-md">
            <p className="text-xs font-semibold">Visa Success Insights</p>
            <p className="text-lg font-bold">89%</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBanner;
