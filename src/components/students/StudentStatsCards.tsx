import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StudentStatsCardsProps {
  stats: {
    total: number;
    active: number;
    reviewNeeded: number;
    completed: number;
  };
}

const StudentStatsCards = ({ stats }: StudentStatsCardsProps) => {
  const cards = [
    {
      title: "Total Students",
      count: stats.total,
      icon: Users,
      accent: "text-primary-foreground",
      bg: "gradient-primary",
      note: "All assigned profiles",
    },
    {
      title: "Active",
      count: stats.active,
      icon: TrendingUp,
      accent: "text-primary-foreground",
      bg: "bg-gradient-to-br from-cyan-500 to-blue-500",
      note: "In application pipeline",
    },
    {
      title: "Need Review",
      count: stats.reviewNeeded,
      icon: AlertTriangle,
      accent: "text-primary-foreground",
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      note: "Waiting counselor actions",
    },
    {
      title: "Completed",
      count: stats.completed,
      icon: CheckCircle,
      accent: "text-primary-foreground",
      bg: "bg-gradient-to-br from-emerald-500 to-green-500",
      note: "Successfully concluded",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((s) => (
        <Card
          key={s.title}
          className="p-5 flex items-center justify-between rounded-2xl glass-card glass-card-hover"
        >
          <div>
            <p className="text-sm text-muted-foreground font-medium">
              {s.title}
            </p>
            <p className="text-3xl font-bold text-foreground mt-1">{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.note}</p>
          </div>
          <div className={`${s.bg} ${s.accent} p-3 rounded-xl shadow-md`}>
            <s.icon className="h-6 w-6" />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StudentStatsCards;
