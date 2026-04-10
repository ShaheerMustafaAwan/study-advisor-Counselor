import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import CounselorLayout from "@/components/dashboard/CounselorLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import FeatureCards from "@/components/dashboard/FeatureCards";
import RecentActivity, {
  type DashboardActivityItem,
} from "@/components/dashboard/RecentActivity";
import { useCounselorStudents } from "@/hooks/useCounselorStudents";
import { getSopReviews } from "@/api/counselorSop";
import { getCounselorNotifications } from "@/api/counselorNotifications";

const toInitials = (name?: string) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const Index = () => {
  const { data: studentsData } = useCounselorStudents({ page: 1, limit: 100 });

  const { data: sopData } = useQuery({
    queryKey: ["dashboard-sop-reviews"],
    queryFn: () => getSopReviews({ status: "all", page: 1, limit: 100 }),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["dashboard-notifications"],
    queryFn: () =>
      getCounselorNotifications({
        page: 1,
        limit: 10,
        read: "all",
        type: "all",
      }),
  });

  const studentsSummary = studentsData?.summary || {
    total: 0,
    active: 0,
    reviewNeeded: 0,
    completed: 0,
    availablePrograms: [],
  };

  const welcomeStats = {
    totalStudents: studentsSummary.total,
    activeApplications: studentsSummary.active,
    pendingReviews: studentsSummary.reviewNeeded,
    completedCases: studentsSummary.completed,
  };

  const featureCounts = {
    students: studentsSummary.total,
    studentProgress: studentsSummary.active,
    sopReview: sopData?.reviews.length || 0,
    notifications: notificationsData?.unreadCount || 0,
    universitySearch: studentsSummary.availablePrograms.length,
  };

  const activities: DashboardActivityItem[] = useMemo(() => {
    const notifications = notificationsData?.notifications || [];

    return notifications.map((item) => ({
      id: `notification-${item.id}`,
      initials: toInitials(item.student?.fullName),
      name: item.student?.fullName || "Student",
      action: item.title || item.message,
      university: item.type,
      status: item.isRead ? "Completed" : "Pending",
      time: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
    }));
  }, [notificationsData?.notifications]);

  return (
    <CounselorLayout>
      <WelcomeBanner stats={welcomeStats} />
      <FeatureCards counts={featureCounts} />
      <RecentActivity activities={activities} />
    </CounselorLayout>
  );
};

export default Index;
