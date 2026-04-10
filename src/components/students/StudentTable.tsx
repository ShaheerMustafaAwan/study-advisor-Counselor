import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StudentRow from "./StudentRow";
import type { Student } from "@/types/student";

const StudentTable = ({ students }: { students: Student[] }) => (
  <div className="overflow-auto rounded-xl border border-border">
    <Table>
      <TableHeader className="sticky top-0 bg-muted/60 backdrop-blur-sm z-10">
        <TableRow>
          <TableHead className="min-w-[180px]">Student</TableHead>
          <TableHead>GPA</TableHead>
          <TableHead>IELTS</TableHead>
          <TableHead>Program</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="min-w-[140px]">Progress</TableHead>
          <TableHead>Next Deadline</TableHead>
          <TableHead>Last Activity</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow>
            <td colSpan={9} className="text-center py-12 text-muted-foreground">
              No students match your filters.
            </td>
          </TableRow>
        ) : (
          students.map((s) => <StudentRow key={s.id} student={s} />)
        )}
      </TableBody>
    </Table>
  </div>
);

export default StudentTable;
