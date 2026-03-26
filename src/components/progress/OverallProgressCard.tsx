import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";

interface Stage {
  label: string;
  status: "Completed" | "Active" | "Under Review" | "Pending";
}

interface Props {
  progress: number;
  stages: Stage[];
}

const statusConfig: Record<Stage["status"], { icon: typeof CheckCircle2; color: string; badgeClass: string }> = {
  Completed: { icon: CheckCircle2, color: "text-emerald-600", badgeClass: "bg-emerald-100 text-emerald-700 border-0" },
  Active: { icon: Loader2, color: "text-primary", badgeClass: "bg-primary/10 text-primary border-0" },
  "Under Review": { icon: Clock, color: "text-amber-600", badgeClass: "bg-amber-100 text-amber-700 border-0" },
  Pending: { icon: Circle, color: "text-muted-foreground", badgeClass: "bg-secondary text-muted-foreground border-0" },
};

const OverallProgressCard = ({ progress, stages }: Props) => {
  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Application Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall Completion</span>
            <span className="text-2xl font-bold text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="space-y-3">
          {stages.map((stage) => {
            const config = statusConfig[stage.status];
            const Icon = config.icon;
            return (
              <div
                key={stage.label}
                className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${config.color} ${stage.status === "Active" ? "animate-spin" : ""}`} />
                  <span className="text-sm font-medium text-foreground">{stage.label}</span>
                </div>
                <Badge className={config.badgeClass}>{stage.status}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallProgressCard;
