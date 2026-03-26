import { useMemo, useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import StudentStatsCards from "@/components/students/StudentStatsCards";
import StudentFilters from "@/components/students/StudentFilters";
import StudentTable from "@/components/students/StudentTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { students } from "@/data/students";

const MyStudents = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [program, setProgram] = useState("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q);
      const matchesStatus = status === "all" || s.status === status;
      const matchesProgram = program === "all" || s.program.includes(program);
      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [search, status, program]);

  return (
    <CounselorLayout>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all your assigned students</p>
      </div>

      <StudentStatsCards />

      <Card className="rounded-xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Student List</CardTitle>
          <CardDescription>Search and filter your assigned students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            program={program}
            onProgramChange={setProgram}
          />
          <StudentTable students={filtered} />
        </CardContent>
      </Card>
    </CounselorLayout>
  );
};

export default MyStudents;
