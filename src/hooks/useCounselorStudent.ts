import { useQuery } from "@tanstack/react-query";
import { getCounselorStudentById } from "@/api/counselorStudents";

export function useCounselorStudent(studentId?: string) {
  return useQuery({
    queryKey: ["counselor-student", studentId],
    queryFn: () => getCounselorStudentById(studentId as string),
    enabled: Boolean(studentId),
    staleTime: 30_000,
  });
}
