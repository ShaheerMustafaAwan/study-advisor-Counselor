import { students } from "./students";

export interface SOPReview {
  id: string;
  studentId: string;
  studentName: string;
  avatarInitials: string;
  program: string;
  submissionDate: string;
  status: "Pending" | "Under Review" | "Approved" | "Revision Required";
  feedback: string;
  lastUpdated: string;
  sopContent: string;
}

export const sopReviews: SOPReview[] = students.map((s) => ({
  id: `sop-${s.id}`,
  studentId: s.id,
  studentName: s.name,
  avatarInitials: s.avatarInitials,
  program: s.program,
  submissionDate: "Jan 15, 2025",
  status:
    s.status === "Completed"
      ? "Approved"
      : s.status === "Review Needed"
        ? "Pending"
        : (["Pending", "Under Review"] as const)[Number(s.id) % 2],
  feedback:
    s.status === "Completed"
      ? "Excellent SOP. Well-structured narrative with clear goals and strong academic alignment."
      : "",
  lastUpdated: s.lastActivity,
  sopContent: `I am writing to express my strong interest in the ${s.program} program. With a GPA of ${s.gpa} and an IELTS score of ${s.ielts}, I believe I have the academic foundation necessary to excel in this program.\n\nThroughout my academic journey, I have developed a deep passion for my field of study. My experiences have equipped me with both theoretical knowledge and practical skills that I am eager to further develop.\n\nI am particularly drawn to the research opportunities and the diverse academic community that your institution offers. I am confident that this program will provide me with the tools and knowledge to make meaningful contributions to my field.\n\nI look forward to the opportunity to bring my unique perspective and dedication to your esteemed program.`,
}));

export const getSOPReview = (studentId: string): SOPReview | undefined =>
  sopReviews.find((s) => s.studentId === studentId);
