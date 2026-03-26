import { useNavigate } from "react-router-dom";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { students } from "@/data/students";

const statusColors: Record<string, string> = {
  Active: "bg-primary/10 text-primary border-0",
  "Review Needed": "bg-amber-100 text-amber-700 border-0",
  Completed: "bg-emerald-100 text-emerald-700 border-0",
};

const StudentProgressList = () => {
  const navigate = useNavigate();

  return (
    <CounselorLayout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a student to view their application progress</p>
      </div>

      <div className="grid gap-3">
        {students.map((s) => (
          <Card
            key={s.id}
            className="shadow-card hover:shadow-card-hover transition-all cursor-pointer hover:border-primary/20"
            onClick={() => navigate(`/dashboard/student-progress/${s.id}`)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                  {s.avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground truncate">{s.name}</h3>
                  <Badge className={statusColors[s.status]}>{s.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{s.program}</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <div className="w-32">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span className="font-medium text-foreground">{s.progress}%</span>
                  </div>
                  <Progress value={s.progress} className="h-2" />
                </div>
                <span className="text-xs text-muted-foreground w-24 text-right">{s.lastActivity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CounselorLayout>
  );
};

export default StudentProgressList;
