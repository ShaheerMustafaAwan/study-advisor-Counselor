import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, GraduationCap, Calendar, Clock } from "lucide-react";

interface Props {
  student: {
    name: string;
    avatarInitials: string;
    program: string;
    email: string;
    phone: string;
    country: string;
    gpa: number;
    ielts: number;
    assignedDate: string;
    lastActivity: string;
    status: "Active" | "Review Needed" | "Completed";
  };
}

const StudentProfileCard = ({ student }: Props) => {
  const statusColor =
    student.status === "Active"
      ? "bg-primary/10 text-primary"
      : student.status === "Review Needed"
      ? "bg-orange-100 text-orange-700"
      : "bg-emerald-100 text-emerald-700";

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">Student Profile</CardTitle>
          <Badge className={`${statusColor} border-0`}>{student.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="gradient-primary text-primary-foreground text-lg font-semibold">
              {student.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{student.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {student.program}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0" />
            <span>{student.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{student.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{student.country}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">GPA</p>
            <p className="text-xl font-bold text-foreground">{student.gpa}</p>
          </div>
          <div className="rounded-xl bg-secondary p-3 text-center">
            <p className="text-xs text-muted-foreground">IELTS</p>
            <p className="text-xl font-bold text-foreground">{student.ielts}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Assigned: {student.assignedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Last active: {student.lastActivity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
