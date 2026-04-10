import { httpGet } from "@/api/http";
import { mapCounselorStudentToUi } from "@/lib/studentMappers";
import type { StudentFiltersQuery, StudentsResponse } from "@/types/student";

export interface CounselorStudentApi {
  id: number;
  fullName: string;
  email: string;
  country: string;
  gpa: number | null;
  ieltsScore: number | null;
  phoneNumber: string | null;
  program: string;
  status: "Active" | "Review Needed" | "Completed";
  progress: number;
  profileCompletion: number;
  createdAt: string;
  lastActivityAt: string;
  documents: Array<{
    id: number;
    type: string;
    fileName: string;
    fileUrl: string;
    createdAt: string;
  }>;
  missingDocumentHints: string[];
}

interface CounselorStudentsApiResponse {
  status: string;
  message: string;
  students: CounselorStudentApi[];
  summary: StudentsResponse["summary"];
  pagination: StudentsResponse["pagination"];
}

interface CounselorStudentByIdApiResponse {
  status: string;
  message: string;
  student: CounselorStudentApi;
}

export interface CounselorStudentActivityApi {
  id: number;
  studentId: number;
  actorId: number | null;
  eventType:
    | "PROFILE_UPDATED"
    | "DOCUMENT_UPLOADED"
    | "DOCUMENT_UPDATED"
    | "DOCUMENT_DELETED"
    | "SOP_DRAFT_SAVED"
    | "SOP_SUBMITTED"
    | "SOP_REVIEWED";
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  actor?: {
    id: number;
    fullName: string;
    role: string;
  } | null;
}

interface CounselorStudentActivitiesApiResponse {
  status: string;
  activities: CounselorStudentActivityApi[];
}

const toQueryString = (query: StudentFiltersQuery) => {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.status && query.status !== "all")
    params.set("status", query.status);
  if (query.program && query.program !== "all")
    params.set("program", query.program);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const value = params.toString();
  return value ? `?${value}` : "";
};

export async function getCounselorStudents(
  query: StudentFiltersQuery,
): Promise<StudentsResponse> {
  const queryString = toQueryString(query);
  const data = await httpGet<CounselorStudentsApiResponse>(
    `/counselor/students${queryString}`,
  );

  return {
    students: data.students.map(mapCounselorStudentToUi),
    summary: data.summary,
    pagination: data.pagination,
  };
}

export async function getCounselorStudentById(
  studentId: string,
): Promise<CounselorStudentApi> {
  const data = await httpGet<CounselorStudentByIdApiResponse>(
    `/counselor/students/${studentId}`,
  );
  return data.student;
}

export async function getCounselorStudentActivities(
  studentId: string,
  limit = 30,
): Promise<CounselorStudentActivityApi[]> {
  const data = await httpGet<CounselorStudentActivitiesApiResponse>(
    `/counselor/students/${studentId}/activities?limit=${limit}`,
  );
  return data.activities;
}
