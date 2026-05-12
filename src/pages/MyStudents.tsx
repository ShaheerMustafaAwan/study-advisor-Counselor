import { useMemo, useState } from "react";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import StudentStatsCards from "@/components/students/StudentStatsCards";
import StudentFilters from "@/components/students/StudentFilters";
import StudentTable from "@/components/students/StudentTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCounselorStudents } from "@/hooks/useCounselorStudents";
import type { StudentStatus } from "@/types/student";

const MyStudents = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [program, setProgram] = useState("all");
  const [page] = useState(1);

  const { data, isLoading, isError, error } = useCounselorStudents({
    q: search || undefined,
    status: status as "all" | StudentStatus,
    program,
    page,
    limit: 100,
  });

  const filtered = useMemo(() => {
    const students = data?.students ?? [];

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
  }, [data?.students, search, status, program]);

  const statusOptions = useMemo(
    () => [
      { value: "all" as const, label: "All Status" },
      { value: "Active" as const, label: "Active" },
      { value: "Review Needed" as const, label: "Review Needed" },
      { value: "Completed" as const, label: "Completed" },
    ],
    [],
  );

  const programOptions = useMemo(() => {
    const options = data?.summary.availablePrograms || [];
    return [
      { value: "all", label: "All Programs" },
      ...options.map((p) => ({ value: p, label: p })),
    ];
  }, [data?.summary.availablePrograms]);

  const stats = data?.summary || {
    total: 0,
    active: 0,
    reviewNeeded: 0,
    completed: 0,
    availablePrograms: [],
  };

  const errorMessage =
    error instanceof Error ? error.message : "Failed to load students";

  return (
    <CounselorLayout>
      <div className="rounded-2xl gradient-surface border border-white/70 p-5 md:p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
        <p className="text-muted-foreground mt-1">
          Track profile quality, progress, and counselor action items from one
          workspace.
        </p>
      </div>

      <StudentStatsCards stats={stats} />

      <Card className="rounded-2xl glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Student List</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading students..."
              : isError
                ? errorMessage
                : "Search and filter your assigned students"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            program={program}
            onProgramChange={setProgram}
            statusOptions={statusOptions}
            programOptions={programOptions}
          />
          <StudentTable students={filtered} />
        </CardContent>
      </Card>
    </CounselorLayout>
  );
};

export default MyStudents;
