import { MessageSquare, FileText, PenLine, User, GraduationCap } from "lucide-react";
import type { ActivityItem } from "@/data/studentProgress";

interface Props {
  activities: ActivityItem[];
}

const iconMap: Record<ActivityItem["type"], { icon: typeof MessageSquare; color: string }> = {
  chat: { icon: MessageSquare, color: "bg-primary/10 text-primary" },
  document: { icon: FileText, color: "bg-emerald-100 text-emerald-700" },
  sop: { icon: PenLine, color: "bg-amber-100 text-amber-700" },
  profile: { icon: User, color: "bg-violet-100 text-violet-700" },
  university: { icon: GraduationCap, color: "bg-sky-100 text-sky-700" },
};

const ActivityTimeline = ({ activities }: Props) => {
  return (
    <div className="relative space-y-0">
      {activities.map((activity, i) => {
        const config = iconMap[activity.type];
        const Icon = config.icon;
        const isLast = i === activities.length - 1;
        return (
          <div key={activity.id} className="flex gap-4 relative pb-6">
            {!isLast && (
              <div className="absolute left-[19px] top-10 bottom-0 w-px bg-border" />
            )}
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="pt-1.5">
              <p className="text-sm font-medium text-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
