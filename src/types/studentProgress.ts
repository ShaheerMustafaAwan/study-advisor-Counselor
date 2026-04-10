import type { Student } from "@/types/student";

export interface StudentDocument {
  id: string;
  name: string;
  uploadStatus: "Uploaded" | "Not Uploaded";
  verificationStatus:
    | "Pending"
    | "Approved"
    | "Reupload Requested"
    | "Rejected";
}

export interface University {
  id: string;
  name: string;
  country: string;
  program: string;
  status:
    | "Considering"
    | "Shortlisted"
    | "Applied"
    | "Offer Received"
    | "Rejected";
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  type: "chat" | "document" | "sop" | "profile" | "university";
}

export interface StudentProgressView {
  student: Student & { phone: string; assignedDate: string };
  stages: {
    label: string;
    status: "Completed" | "Active" | "Under Review" | "Pending";
  }[];
  documents: StudentDocument[];
  universities: University[];
  sopContent: string;
  activities: ActivityItem[];
}
