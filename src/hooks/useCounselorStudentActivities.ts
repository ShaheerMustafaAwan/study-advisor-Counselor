import { useQuery } from "@tanstack/react-query";
import { getCounselorStudentActivities } from "@/api/counselorStudents";

export function useCounselorStudentActivities(studentId?: string, limit = 30) {
  return useQuery({
    queryKey: ["counselor-student-activities", studentId, limit],
    queryFn: () => getCounselorStudentActivities(studentId as string, limit),
    enabled: Boolean(studentId),
    staleTime: 15_000,
  });
}
