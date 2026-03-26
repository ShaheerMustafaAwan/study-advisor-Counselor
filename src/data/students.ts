export interface Student {
  id: string;
  name: string;
  email: string;
  country: string;
  gpa: number;
  ielts: number;
  program: string;
  status: "Active" | "Review Needed" | "Completed";
  progress: number;
  nextDeadline: string;
  lastActivity: string;
  avatarInitials: string;
}

export const students: Student[] = [
  { id: "1", name: "Aarav Sharma", email: "aarav@email.com", country: "India", gpa: 3.8, ielts: 7.5, program: "Computer Science – Masters", status: "Active", progress: 72, nextDeadline: "Document Review – Jan 25", lastActivity: "2 hours ago", avatarInitials: "AS" },
  { id: "2", name: "Mei Lin Chen", email: "meichen@email.com", country: "China", gpa: 3.9, ielts: 8.0, program: "Data Science – Masters", status: "Active", progress: 85, nextDeadline: "SOP Submission – Feb 1", lastActivity: "5 hours ago", avatarInitials: "MC" },
  { id: "3", name: "Fatima Al-Hassan", email: "fatima@email.com", country: "UAE", gpa: 3.5, ielts: 6.5, program: "Business Administration – MBA", status: "Review Needed", progress: 45, nextDeadline: "IELTS Retake – Jan 30", lastActivity: "1 day ago", avatarInitials: "FA" },
  { id: "4", name: "James Okonkwo", email: "james@email.com", country: "Nigeria", gpa: 3.7, ielts: 7.0, program: "Computer Science – Masters", status: "Completed", progress: 100, nextDeadline: "Visa Interview – Feb 10", lastActivity: "3 days ago", avatarInitials: "JO" },
  { id: "5", name: "Priya Patel", email: "priya@email.com", country: "India", gpa: 3.6, ielts: 7.0, program: "Data Science – Masters", status: "Active", progress: 60, nextDeadline: "Transcript Upload – Feb 5", lastActivity: "30 minutes ago", avatarInitials: "PP" },
  { id: "6", name: "Carlos Rivera", email: "carlos@email.com", country: "Mexico", gpa: 3.4, ielts: 6.5, program: "Business Administration – MBA", status: "Review Needed", progress: 35, nextDeadline: "GRE Score – Feb 15", lastActivity: "4 hours ago", avatarInitials: "CR" },
  { id: "7", name: "Sophie Laurent", email: "sophie@email.com", country: "France", gpa: 3.9, ielts: 8.5, program: "Computer Science – Masters", status: "Active", progress: 90, nextDeadline: "Final Review – Jan 28", lastActivity: "1 hour ago", avatarInitials: "SL" },
  { id: "8", name: "Kenji Tanaka", email: "kenji@email.com", country: "Japan", gpa: 3.8, ielts: 7.5, program: "Data Science – Masters", status: "Completed", progress: 100, nextDeadline: "Enrollment – Mar 1", lastActivity: "2 days ago", avatarInitials: "KT" },
];
