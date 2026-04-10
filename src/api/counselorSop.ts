import { httpGet, httpPost, httpPut } from "@/api/http";

export type SopStatusApi =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVISION_REQUESTED"
  | "APPROVED";

export type SopStatusLabel =
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Revision Required"
  | "Draft";

export interface SopReviewCommentApi {
  id: number;
  sopId: number;
  authorId: number;
  body: string;
  createdAt: string;
  author?: {
    id: number;
    fullName: string;
    role: string;
  };
}

export interface SopReviewApi {
  id: number;
  userId: number;
  documentId: number | null;
  version: number;
  title: string;
  content: string;
  status: SopStatusApi;
  reviewNotes: string | null;
  reviewedBy: number | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  reviewer?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
  document?: {
    id: number;
    fileName: string;
    fileUrl: string;
    createdAt?: string;
  } | null;
  comments?: SopReviewCommentApi[];
}

interface SopReviewListResponse {
  status: "success" | "error";
  reviews: SopReviewApi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SopReviewByIdResponse {
  status: "success" | "error";
  review: SopReviewApi;
}

interface SopReviewUpdateResponse {
  status: "success" | "error";
  message?: string;
  review: SopReviewApi;
}

interface SopReviewCommentResponse {
  status: "success" | "error";
  message?: string;
  comment: SopReviewCommentApi;
}

const SOP_STATUS_LABELS: Record<SopStatusApi, SopStatusLabel> = {
  DRAFT: "Draft",
  SUBMITTED: "Pending",
  UNDER_REVIEW: "Under Review",
  REVISION_REQUESTED: "Revision Required",
  APPROVED: "Approved",
};

const LABEL_TO_SOP_STATUS: Record<SopStatusLabel, SopStatusApi> = {
  Draft: "DRAFT",
  Pending: "SUBMITTED",
  "Under Review": "UNDER_REVIEW",
  Approved: "APPROVED",
  "Revision Required": "REVISION_REQUESTED",
};

export function toSopStatusLabel(status: SopStatusApi): SopStatusLabel {
  return SOP_STATUS_LABELS[status] || "Pending";
}

export function toSopStatusApi(status: SopStatusLabel): SopStatusApi {
  return LABEL_TO_SOP_STATUS[status] || "SUBMITTED";
}

export interface SopReviewQuery {
  status?: "all" | SopStatusApi;
  page?: number;
  limit?: number;
}

function toQueryString(query: SopReviewQuery = {}) {
  const params = new URLSearchParams();

  if (query.status) params.set("status", query.status);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const value = params.toString();
  return value ? `?${value}` : "";
}

export async function getSopReviews(query: SopReviewQuery = {}) {
  return httpGet<SopReviewListResponse>(
    `/counselor/sop-reviews${toQueryString(query)}`,
  );
}

export async function getSopReviewById(sopId: number | string) {
  return httpGet<SopReviewByIdResponse>(`/counselor/sop-reviews/${sopId}`);
}

export async function updateSopReview(
  sopId: number | string,
  payload: {
    status?: SopStatusApi;
    reviewNotes?: string;
  },
) {
  return httpPut<SopReviewUpdateResponse>(
    `/counselor/sop-reviews/${sopId}`,
    payload,
  );
}

export async function addSopReviewComment(
  sopId: number | string,
  body: string,
) {
  return httpPost<SopReviewCommentResponse>(
    `/counselor/sop-reviews/${sopId}/comments`,
    {
      body,
    },
  );
}
