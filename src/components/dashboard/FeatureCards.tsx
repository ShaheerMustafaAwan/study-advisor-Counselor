import { Users, BarChart3, FileText, Bell, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Student Management",
    description: "View and manage all assigned students",
    count: 128,
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: BarChart3,
    title: "Student Progress",
    description: "Track academic milestones and deadlines",
    count: 34,
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: FileText,
    title: "SOP Review",
    description: "Review and provide feedback on SOPs",
    count: 12,
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay updated with student activities",
    count: 5,
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Search,
    title: "University Search",
    description: "Explore universities and programs",
    count: 250,
    color: "from-cyan-500 to-blue-500",
  },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm`}
            >
              <feature.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-semibold bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
              {feature.count}
            </span>
          </div>
          <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
          <p className="text-sm text-muted-foreground mb-5">{feature.description}</p>
          <Button variant="gradient" size="sm" className="w-full gap-1.5 rounded-xl">
            Open <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
