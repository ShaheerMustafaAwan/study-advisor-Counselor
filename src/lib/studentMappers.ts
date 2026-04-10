import { formatDistanceToNow } from "date-fns";
import type { Student } from "@/types/student";

interface CounselorStudentApi {
  id: number;
  fullName: string;
  email: string;
  country: string;
  gpa: number | null;
  ieltsScore: number | null;
  program: string;
  status: Student["status"];
  progress: number;
  lastActivityAt: string;
  missingDocumentHints: string[];
}

const getAvatarInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "NA";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatLastActivity = (lastActivityAt: string) => {
  const date = new Date(lastActivityAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${formatDistanceToNow(date, { addSuffix: true })}`;
};

const getNextDeadlineLabel = (missingDocumentHints: string[]) => {
  if (!missingDocumentHints.length) {
    return "All required docs uploaded";
  }

  return `Pending: ${missingDocumentHints[0]}`;
};

export const mapCounselorStudentToUi = (
  student: CounselorStudentApi,
): Student => {
  return {
    id: String(student.id),
    name: student.fullName,
    email: student.email,
    country: student.country,
    gpa: student.gpa ?? 0,
    ielts: student.ieltsScore ?? 0,
    program: student.program,
    status: student.status,
    progress: student.progress,
    nextDeadline: getNextDeadlineLabel(student.missingDocumentHints || []),
    lastActivity: formatLastActivity(student.lastActivityAt),
    avatarInitials: getAvatarInitials(student.fullName),
  };
};
