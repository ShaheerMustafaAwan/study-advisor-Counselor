import { format, formatDistanceToNow } from "date-fns";
import type {
  CounselorStudentActivityApi,
  CounselorStudentApi,
} from "@/api/counselorStudents";
import type {
  ActivityItem,
  StudentDocument,
  StudentProgressView,
  University,
} from "@/types/studentProgress";

const getAvatarInitials = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return "NA";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  ACADEMIC_TRANSCRIPT: "Academic Transcript",
  DEGREE_DIPLOMA: "Degree/Diploma",
  LANGUAGE_PROFICIENCY: "Language Proficiency",
  PASSPORT_COPY: "Passport Copy",
  RESUME_CV: "Resume/CV",
  STATEMENT_OF_PURPOSE: "Statement of Purpose",
};

const formatDocType = (docType: string) => {
  return DOCUMENT_TYPE_LABELS[docType] || docType;
};

const getRelativeTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return formatDistanceToNow(date, { addSuffix: true });
};

const toProgressStages = (
  student: CounselorStudentApi,
): StudentProgressView["stages"] => {
  const documentsUploaded = student.documents.length > 0;
  const hasSop = student.documents.some(
    (doc) => doc.type === "STATEMENT_OF_PURPOSE",
  );

  return [
    {
      label: "Profile Setup",
      status:
        student.profileCompletion >= 80
          ? "Completed"
          : student.profileCompletion >= 40
            ? "Active"
            : "Pending",
    },
    {
      label: "Document Upload",
      status: documentsUploaded ? "Active" : "Pending",
    },
    {
      label: "University Recommendations",
      status: student.progress >= 70 ? "Completed" : "Pending",
    },
    {
      label: "SOP Status",
      status: hasSop ? "Under Review" : "Pending",
    },
    {
      label: "AI Consultation",
      status: "Pending",
    },
  ];
};

const toDocuments = (student: CounselorStudentApi): StudentDocument[] => {
  const uploadedDocs: StudentDocument[] = student.documents.map((doc) => ({
    id: String(doc.id),
    name: doc.fileName || formatDocType(doc.type),
    fileUrl: doc.fileUrl || null,
    uploadedAt: doc.createdAt,
    documentType: doc.type,
    uploadStatus: "Uploaded",
    verificationStatus: doc.verificationStatus || "Pending",
    reviewNote: doc.reviewNote || null,
    reviewedAt: doc.reviewedAt || null,
  }));

  const pendingDocs: StudentDocument[] = student.missingDocumentHints.map(
    (name) => ({
      id: `missing-${name}`,
      name,
      fileUrl: null,
      uploadedAt: null,
      documentType: "MISSING",
      uploadStatus: "Not Uploaded",
      verificationStatus: "Pending",
    }),
  );

  return [...uploadedDocs, ...pendingDocs];
};

const toUniversities = (student: CounselorStudentApi): University[] => {
  return [];
};

const toActivities = (student: CounselorStudentApi): ActivityItem[] => {
  const activities: ActivityItem[] = [
    {
      id: `activity-last-${student.id}`,
      action: "Profile was updated",
      timestamp: getRelativeTime(student.lastActivityAt),
      type: "profile",
    },
  ];

  student.documents.slice(0, 5).forEach((doc) => {
    activities.push({
      id: `activity-doc-${doc.id}`,
      action: `Uploaded ${formatDocType(doc.type)}`,
      timestamp: getRelativeTime(doc.createdAt),
      type: "document",
    });
  });

  return activities;
};

const toSopContent = (student: CounselorStudentApi) => {
  const hasSop = student.documents.some(
    (doc) => doc.type === "STATEMENT_OF_PURPOSE",
  );

  if (hasSop) {
    return "SOP document has been uploaded by the student. Open the uploaded file from documents for full review.";
  }

  return "No SOP document uploaded yet by this student.";
};

export const mapCounselorStudentToProgressView = (
  student: CounselorStudentApi,
): StudentProgressView => {
  const assignedDate = Number.isNaN(new Date(student.createdAt).getTime())
    ? "Unknown"
    : format(new Date(student.createdAt), "MMM dd, yyyy");

  return {
    student: {
      id: String(student.id),
      name: student.fullName,
      email: student.email,
      country: student.country,
      gpa: student.gpa ?? 0,
      ielts: student.ieltsScore ?? 0,
      program: student.program,
      status: student.status,
      progress: student.progress,
      nextDeadline: student.missingDocumentHints[0] || "No pending deadlines",
      lastActivity: getRelativeTime(student.lastActivityAt),
      avatarInitials: getAvatarInitials(student.fullName),
      phone: student.phoneNumber || "Not provided",
      assignedDate,
    },
    stages: toProgressStages(student),
    documents: toDocuments(student),
    universities: toUniversities(student),
    sopContent: toSopContent(student),
    activities: toActivities(student),
  };
};

const ACTIVITY_TYPE_MAP: Record<
  CounselorStudentActivityApi["eventType"],
  ActivityItem["type"]
> = {
  PROFILE_UPDATED: "profile",
  DOCUMENT_UPLOADED: "document",
  DOCUMENT_UPDATED: "document",
  DOCUMENT_DELETED: "document",
  SOP_DRAFT_SAVED: "sop",
  SOP_SUBMITTED: "sop",
  SOP_REVIEWED: "sop",
};

export const mapStudentActivitiesToTimeline = (
  activities: CounselorStudentActivityApi[],
): ActivityItem[] => {
  const resolveType = (
    activity: CounselorStudentActivityApi,
  ): ActivityItem["type"] => {
    if (
      activity.eventType === "PROFILE_UPDATED" &&
      activity.metadata &&
      typeof activity.metadata === "object" &&
      "kind" in activity.metadata &&
      (activity.metadata as Record<string, unknown>).kind ===
        "UNIVERSITY_STATUS_UPDATE"
    ) {
      return "university";
    }

    return ACTIVITY_TYPE_MAP[activity.eventType] || "profile";
  };

  return activities.map((activity) => ({
    id: `activity-${activity.id}`,
    action: activity.description,
    timestamp: getRelativeTime(activity.createdAt),
    type: resolveType(activity),
  }));
};
