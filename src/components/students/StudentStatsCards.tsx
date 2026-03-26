import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  { title: "Total Students", count: 128, icon: Users, accent: "text-primary", bg: "bg-primary/10" },
  { title: "Active", count: 84, icon: TrendingUp, accent: "text-blue-600", bg: "bg-blue-50" },
  { title: "Need Review", count: 23, icon: AlertTriangle, accent: "text-orange-500", bg: "bg-orange-50" },
  { title: "Completed", count: 21, icon: CheckCircle, accent: "text-green-600", bg: "bg-green-50" },
];

const StudentStatsCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {stats.map((s) => (
      <Card
        key={s.title}
        className="p-5 flex items-center justify-between rounded-xl border border-border hover:shadow-md transition-shadow"
      >
        <div>
          <p className="text-sm text-muted-foreground font-medium">{s.title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{s.count}</p>
        </div>
        <div className={`${s.bg} ${s.accent} p-3 rounded-xl`}>
          <s.icon className="h-6 w-6" />
        </div>
      </Card>
    ))}
  </div>
);

export default StudentStatsCards;
