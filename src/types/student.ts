export type StudentStatus = "Active" | "Review Needed" | "Completed";

export interface Student {
  id: string;
  name: string;
  email: string;
  country: string;
  gpa: number;
  ielts: number;
  program: string;
  status: StudentStatus;
  progress: number;
  nextDeadline: string;
  lastActivity: string;
  avatarInitials: string;
}

export interface StudentFiltersQuery {
  q?: string;
  status?: "all" | StudentStatus;
  program?: string;
  page?: number;
  limit?: number;
}

export interface StudentSummary {
  total: number;
  active: number;
  reviewNeeded: number;
  completed: number;
  availablePrograms: string[];
}

export interface StudentsResponse {
  students: Student[];
  summary: StudentSummary;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
