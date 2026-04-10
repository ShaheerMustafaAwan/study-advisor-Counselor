import { useQuery } from "@tanstack/react-query";
import { getCounselorStudents } from "@/api/counselorStudents";
import type { StudentFiltersQuery } from "@/types/student";

export function useCounselorStudents(query: StudentFiltersQuery) {
  return useQuery({
    queryKey: ["counselor-students", query],
    queryFn: () => getCounselorStudents(query),
    staleTime: 30_000,
  });
}
