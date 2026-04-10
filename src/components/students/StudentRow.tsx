import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import StudentActions from "./StudentActions";
import type { Student } from "@/types/student";

const statusStyle: Record<string, string> = {
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  "Review Needed": "bg-orange-50 text-orange-700 border-orange-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const StudentRowComponent = ({ student }: { student: Student }) => (
  <TableRow className="hover:bg-muted/40 transition-colors">
    <TableCell>
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {student.avatarInitials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground text-sm">{student.name}</p>
          <p className="text-xs text-muted-foreground">{student.country}</p>
        </div>
      </div>
    </TableCell>
    <TableCell className="text-sm">{student.gpa}</TableCell>
    <TableCell className="text-sm">{student.ielts}</TableCell>
    <TableCell className="text-sm max-w-[180px] truncate">
      {student.program}
    </TableCell>
    <TableCell>
      <Badge
        variant="outline"
        className={`${statusStyle[student.status]} font-medium text-xs`}
      >
        {student.status}
      </Badge>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress value={student.progress} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {student.progress}%
        </span>
      </div>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
      {student.nextDeadline}
    </TableCell>
    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
      {student.lastActivity}
    </TableCell>
    <TableCell>
      <StudentActions studentId={student.id} email={student.email} />
    </TableCell>
  </TableRow>
);

export default StudentRowComponent;
