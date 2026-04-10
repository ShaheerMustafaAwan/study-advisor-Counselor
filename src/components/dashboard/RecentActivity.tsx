export interface DashboardActivityItem {
  id: string;
  initials: string;
  name: string;
  action: string;
  university: string;
  status: "Pending" | "In Progress" | "Completed" | "Upcoming";
  time: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Upcoming: "bg-violet-50 text-violet-700",
};

interface RecentActivityProps {
  activities: DashboardActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-lg font-semibold">Recent Student Activity</h2>
      </div>

      {activities.length === 0 && (
        <div className="px-6 py-8 text-sm text-muted-foreground">
          No recent activity yet.
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-6 font-medium text-muted-foreground">
                Student
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Action
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                University
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-right py-3 px-6 font-medium text-muted-foreground">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr
                key={a.id}
                className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
              >
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0">
                      {a.initials}
                    </div>
                    <span className="font-medium">{a.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {a.action}
                </td>
                <td className="py-3.5 px-4 font-medium">{a.university}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[a.status] ?? ""}`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3.5 px-6 text-right text-muted-foreground text-xs">
                  {a.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list */}
      <div className="md:hidden divide-y divide-border">
        {activities.map((a) => (
          <div key={a.id} className="px-5 py-4 flex items-start gap-3">
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground shrink-0 mt-0.5">
              {a.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm truncate">{a.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {a.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {a.action} — {a.university}
              </p>
              <span
                className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[a.status] ?? ""}`}
              >
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
