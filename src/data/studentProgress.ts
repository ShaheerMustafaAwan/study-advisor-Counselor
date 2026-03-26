import { students, Student } from "./students";

export interface StudentDocument {
  id: string;
  name: string;
  uploadStatus: "Uploaded" | "Not Uploaded";
  verificationStatus: "Pending" | "Approved" | "Reupload Requested" | "Rejected";
}

export interface University {
  id: string;
  name: string;
  country: string;
  program: string;
  status: "Considering" | "Shortlisted" | "Applied" | "Offer Received" | "Rejected";
}

export interface ActivityItem {
  id: string;
  action: string;
  timestamp: string;
  type: "chat" | "document" | "sop" | "profile" | "university";
}

export interface StudentProgress {
  student: Student & { phone: string; assignedDate: string };
  stages: { label: string; status: "Completed" | "Active" | "Under Review" | "Pending" }[];
  documents: StudentDocument[];
  universities: University[];
  sopContent: string;
  activities: ActivityItem[];
}

export const getStudentProgress = (id: string): StudentProgress | undefined => {
  const student = students.find((s) => s.id === id);
  if (!student) return undefined;

  return {
    student: {
      ...student,
      phone: "+1 (555) 012-3456",
      assignedDate: "Dec 15, 2024",
    },
    stages: [
      { label: "Profile Setup", status: "Completed" },
      { label: "Document Upload", status: "Active" },
      { label: "University Recommendations", status: "Completed" },
      { label: "SOP Status", status: "Under Review" },
      { label: "AI Consultation", status: "Active" },
    ],
    documents: [
      { id: "d1", name: "Academic Transcript", uploadStatus: "Uploaded", verificationStatus: "Pending" },
      { id: "d2", name: "Passport Copy", uploadStatus: "Uploaded", verificationStatus: "Pending" },
      { id: "d3", name: "IELTS Score Report", uploadStatus: "Uploaded", verificationStatus: "Pending" },
      { id: "d4", name: "Letter of Recommendation", uploadStatus: "Not Uploaded", verificationStatus: "Pending" },
      { id: "d5", name: "Financial Statement", uploadStatus: "Uploaded", verificationStatus: "Pending" },
    ],
    universities: [
      { id: "u1", name: "University of Toronto", country: "Canada", program: student.program, status: "Considering" },
      { id: "u2", name: "MIT", country: "USA", program: student.program, status: "Considering" },
      { id: "u3", name: "University of Melbourne", country: "Australia", program: student.program, status: "Considering" },
      { id: "u4", name: "Imperial College London", country: "UK", program: student.program, status: "Considering" },
      { id: "u5", name: "ETH Zurich", country: "Switzerland", program: student.program, status: "Considering" },
    ],
    sopContent: `I am writing to express my strong interest in the ${student.program} program. With a GPA of ${student.gpa} and an IELTS score of ${student.ielts}, I believe I have the academic foundation necessary to excel in this program.\n\nThroughout my academic journey, I have developed a deep passion for my field of study. My experiences have equipped me with both theoretical knowledge and practical skills that I am eager to further develop.\n\nI am particularly drawn to the research opportunities and the diverse academic community that your institution offers. I am confident that this program will provide me with the tools and knowledge to make meaningful contributions to my field.\n\nI look forward to the opportunity to bring my unique perspective and dedication to your esteemed program.`,
    activities: [
      { id: "a1", action: "Attended AI chatbot consultation session", timestamp: "2 hours ago", type: "chat" },
      { id: "a2", action: "Uploaded Academic Transcript", timestamp: "5 hours ago", type: "document" },
      { id: "a3", action: "Submitted Statement of Purpose draft", timestamp: "1 day ago", type: "sop" },
      { id: "a4", action: "Updated profile information", timestamp: "2 days ago", type: "profile" },
      { id: "a5", action: "Added University of Toronto to shortlist", timestamp: "3 days ago", type: "university" },
      { id: "a6", action: "Completed IELTS score upload", timestamp: "4 days ago", type: "document" },
      { id: "a7", action: "Started AI-powered university matching", timestamp: "5 days ago", type: "chat" },
    ],
  };
};
