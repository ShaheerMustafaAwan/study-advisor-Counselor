export interface Notification {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
  type: "Documents" | "SOP" | "Application" | "System Alert";
  priority: "High" | "Medium" | "Low";
  timestamp: string;
  read: boolean;
  description: string;
}

export const notifications: Notification[] = [
  { id: "n1", title: "Document verification pending", studentId: "1", studentName: "Aarav Sharma", type: "Documents", priority: "High", timestamp: "10 minutes ago", read: false, description: "Academic transcript requires counselor verification before deadline." },
  { id: "n2", title: "SOP submitted for review", studentId: "2", studentName: "Mei Lin Chen", type: "SOP", priority: "High", timestamp: "1 hour ago", read: false, description: "New Statement of Purpose draft submitted and awaiting feedback." },
  { id: "n3", title: "Application deadline approaching", studentId: "3", studentName: "Fatima Al-Hassan", type: "Application", priority: "High", timestamp: "2 hours ago", read: false, description: "University of Toronto application deadline is in 3 days." },
  { id: "n4", title: "Profile update completed", studentId: "5", studentName: "Priya Patel", type: "System Alert", priority: "Low", timestamp: "3 hours ago", read: true, description: "Student updated contact information and test scores." },
  { id: "n5", title: "IELTS score uploaded", studentId: "6", studentName: "Carlos Rivera", type: "Documents", priority: "Medium", timestamp: "5 hours ago", read: false, description: "New IELTS score report uploaded and ready for review." },
  { id: "n6", title: "SOP revision requested", studentId: "7", studentName: "Sophie Laurent", type: "SOP", priority: "Medium", timestamp: "6 hours ago", read: true, description: "Counselor requested changes to the SOP introduction section." },
  { id: "n7", title: "Offer received from MIT", studentId: "8", studentName: "Kenji Tanaka", type: "Application", priority: "High", timestamp: "1 day ago", read: true, description: "Student received an admission offer from MIT for Data Science." },
  { id: "n8", title: "Missing financial documents", studentId: "3", studentName: "Fatima Al-Hassan", type: "Documents", priority: "High", timestamp: "1 day ago", read: false, description: "Financial statement has not been uploaded yet." },
  { id: "n9", title: "System maintenance scheduled", studentId: "", studentName: "System", type: "System Alert", priority: "Low", timestamp: "2 days ago", read: true, description: "Platform maintenance window scheduled for this weekend." },
  { id: "n10", title: "New student assigned", studentId: "5", studentName: "Priya Patel", type: "System Alert", priority: "Medium", timestamp: "3 days ago", read: true, description: "A new student has been assigned to your counseling roster." },
];
