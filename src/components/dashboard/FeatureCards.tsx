import {
  Users,
  BarChart3,
  FileText,
  Bell,
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureCardsProps {
  counts: {
    students: number;
    studentProgress: number;
    sopReview: number;
    notifications: number;
    universitySearch: number;
  };
}

const buildFeatures = (counts: FeatureCardsProps["counts"]) => [
  {
    icon: Users,
    title: "Student Management",
    description: "View and manage all assigned students",
    count: counts.students,
    color: "from-blue-500 to-indigo-500",
    route: "/my-students",
  },
  {
    icon: BarChart3,
    title: "Student Progress",
    description: "Track academic milestones and deadlines",
    count: counts.studentProgress,
    color: "from-indigo-500 to-purple-500",
    route: "/student-progress",
  },
  {
    icon: FileText,
    title: "SOP Review",
    description: "Review and provide feedback on SOPs",
    count: counts.sopReview,
    color: "from-violet-500 to-purple-500",
    route: "/sop-review",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay updated with student activities",
    count: counts.notifications,
    color: "from-blue-400 to-blue-600",
    route: "/notifications",
  },
  {
    icon: Search,
    title: "University Search",
    description: "Explore universities and programs",
    count: counts.universitySearch,
    color: "from-cyan-500 to-blue-500",
    route: "/university-search",
  },
];

const FeatureCards = ({ counts }: FeatureCardsProps) => {
  const navigate = useNavigate();
  const features = buildFeatures(counts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group glass-card glass-card-hover rounded-2xl p-6 border border-white/70"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110`}
            >
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {feature.count}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1 text-foreground">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {feature.description}
          </p>
          <Button
            variant="gradient"
            size="sm"
            className="w-full gap-1.5 rounded-xl"
            onClick={() => navigate(feature.route)}
          >
            Open{" "}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
