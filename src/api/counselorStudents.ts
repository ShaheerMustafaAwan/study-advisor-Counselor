import { httpGet, httpPut } from "@/api/http";
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
    verificationStatus?:
      | "Pending"
      | "Approved"
      | "Reupload Requested"
      | "Rejected";
    reviewedAt?: string | null;
    reviewNote?: string | null;
    reviewedBy?: {
      id: number;
      fullName: string;
      role: string;
    } | null;
  }>;
  missingDocumentHints: string[];
}

export interface CounselorStudentSopApi {
  id: number;
  userId: number;
  version: number;
  title: string | null;
  content: string | null;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "REVISION_REQUESTED"
    | "APPROVED";
  reviewNotes: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string;
  createdAt: string;
  reviewer?: {
    id: number;
    fullName: string;
    role: string;
  } | null;
  document?: {
    id: number;
    fileName: string;
    fileUrl: string;
    createdAt: string;
  } | null;
  comments?: Array<{
    id: number;
    body: string;
    createdAt: string;
    author?: {
      id: number;
      fullName: string;
      role: string;
    } | null;
  }>;
}

export interface CounselorStudentUniversityApi {
  id: string;
  universityId: number;
  name: string;
  country: string;
  program: string;
  status:
    | "Considering"
    | "Shortlisted"
    | "Applied"
    | "Offer Received"
    | "Rejected";
  note: string | null;
  updatedAt: string | null;
  matchScore: number;
  eligibilityScore: number;
  similarityScore: number;
  reasons: string[];
  tuitionFeeUsd: number | null;
  worldRanking: number | null;
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

interface CounselorStudentLatestSopResponse {
  status: string;
  sop: CounselorStudentSopApi | null;
}

interface CounselorStudentUniversitiesResponse {
  status: string;
  universities: CounselorStudentUniversityApi[];
  totalConsidered?: number;
  algorithmVersion?: string;
  message?: string;
}

interface CounselorStudentUniversityStatusUpdateResponse {
  status: string;
  message: string;
  university: CounselorStudentUniversityApi;
}

interface CounselorStudentDocumentReviewUpdateResponse {
  status: string;
  message: string;
  review: {
    documentId: number;
    verificationStatus:
      | "Pending"
      | "Approved"
      | "Reupload Requested"
      | "Rejected";
    reviewNote: string | null;
    reviewedAt: string;
    reviewedBy: {
      id: number;
      fullName: string;
      role: string;
    } | null;
  };
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

export async function getCounselorStudentLatestSop(
  studentId: string,
): Promise<CounselorStudentSopApi | null> {
  const data = await httpGet<CounselorStudentLatestSopResponse>(
    `/counselor/students/${studentId}/sop/latest`,
  );
  return data.sop || null;
}

export async function getCounselorStudentUniversities(
  studentId: string,
  topK = 5,
): Promise<CounselorStudentUniversityApi[]> {
  const data = await httpGet<CounselorStudentUniversitiesResponse>(
    `/counselor/students/${studentId}/universities?topK=${topK}`,
  );
  return data.universities || [];
}

export async function updateCounselorStudentUniversityStatus(
  studentId: string,
  universityId: number,
  payload: {
    status:
      | "Considering"
      | "Shortlisted"
      | "Applied"
      | "Offer Received"
      | "Rejected";
    note?: string;
  },
) {
  return httpPut<CounselorStudentUniversityStatusUpdateResponse>(
    `/counselor/students/${studentId}/universities/${universityId}/status`,
    payload,
  );
}

export async function updateCounselorStudentDocumentReview(
  studentId: string,
  documentId: number,
  payload: {
    verificationStatus:
      | "Pending"
      | "Approved"
      | "Reupload Requested"
      | "Rejected";
    note?: string;
  },
) {
  return httpPut<CounselorStudentDocumentReviewUpdateResponse>(
    `/counselor/students/${studentId}/documents/${documentId}/review`,
    payload,
  );
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
