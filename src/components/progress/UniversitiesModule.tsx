import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, GraduationCap } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCounselorStudentUniversities,
  updateCounselorStudentUniversityStatus,
} from "@/api/counselorStudents";
import type { University } from "@/types/studentProgress";

interface Props {
  studentId: string;
  universities: University[];
}

const statusColors: Record<string, string> = {
  Considering: "bg-secondary text-muted-foreground border-0",
  Shortlisted: "bg-primary/10 text-primary border-0",
  Applied: "bg-amber-100 text-amber-700 border-0",
  "Offer Received": "bg-emerald-100 text-emerald-700 border-0",
  Rejected: "bg-destructive/10 text-destructive border-0",
};

const UniversitiesModule = ({ studentId, universities: initial }: Props) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["counselor-student-universities", studentId],
    queryFn: () => getCounselorStudentUniversities(studentId, 8),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  });

  const [universities, setUniversities] = useState(initial);

  useEffect(() => {
    if (!data) return;

    setUniversities(
      data.map((uni) => ({
        id: uni.id,
        universityId: uni.universityId,
        name: uni.name,
        country: uni.country,
        program: uni.program,
        status: uni.status,
        note: uni.note,
        updatedAt: uni.updatedAt,
        matchScore: uni.matchScore,
      })),
    );
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      universityId?: number;
      status: University["status"];
    }) => {
      const parsedUniversityId = payload.universityId ?? Number(payload.id);
      if (Number.isNaN(parsedUniversityId)) {
        throw new Error("Invalid university id");
      }

      await updateCounselorStudentUniversityStatus(
        studentId,
        parsedUniversityId,
        {
          status: payload.status,
        },
      );

      return payload;
    },
    onSuccess: ({ id, status }) => {
      setUniversities((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status } : u)),
      );
      toast.success("University status updated");
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-universities", studentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["counselor-student-activities", studentId],
      });
    },
    onError: (error) => {
      toast.error(
        (error as Error).message || "Failed to update university status",
      );
    },
  });

  const updateStatus = (id: string, status: University["status"]) => {
    const target = universities.find((u) => u.id === id);
    statusMutation.mutate({
      id,
      universityId: target?.universityId,
      status,
    });
  };

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading universities...
      </div>
    );
  }

  if (!universities.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No dynamic university recommendations available yet for this student
        profile.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {universities.map((uni) => (
        <Card
          key={uni.id}
          className="shadow-card hover:shadow-card-hover transition-shadow"
        >
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-foreground truncate">
                {uni.name}
              </h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {uni.country}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {uni.program}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge className={statusColors[uni.status]}>{uni.status}</Badge>
              <Select
                value={uni.status}
                onValueChange={(v) =>
                  updateStatus(uni.id, v as University["status"])
                }
              >
                <SelectTrigger
                  className="h-8 text-xs w-[150px]"
                  disabled={statusMutation.isPending}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Considering">Considering</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Offer Received">Offer Received</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UniversitiesModule;
